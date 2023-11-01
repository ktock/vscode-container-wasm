/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { Event, EventEmitter } from 'vscode';

import RAL from './ral';
import { Stdio, WasmPseudoterminal, PseudoterminalState } from './api';

class LineBuffer {

	private offset: number;
	private cursor: number;
	private content: string[];
	constructor() {
		this.offset = 0;
		this.cursor = 0;
		this.content = [];
	}

	public clear(): void {
		this.offset = 0;
		this.cursor = 0;
		this.content = [];
	}

	public setContent(content: string): void {
		this.content = content.split('');
		this.cursor = this.content.length;
	}

	public getOffset(): number {
		return this.offset;
	}

	public setOffset(offset: number): void {
		this.offset = offset;
	}

	public getLine(): string {
		return this.content.join('');
	}

	public getCursor(): number {
		return this.cursor;
	}

	public isCursorAtEnd(): boolean {
		return this.cursor === this.content.length;
	}

	public isCursorAtBeginning(): boolean {
		return this.cursor === 0;
	}

	public insert(value: String) {
		for (const char of value) {
			this.content.splice(this.cursor, 0, char);
			this.cursor++;
		}
	}

	public del(): boolean {
		if (this.cursor === this.content.length) {
			return false;
		}
		this.content.splice(this.cursor, 1);
		return true;
	}

	public backspace(): boolean {
		if (this.cursor === 0) {
			return false;
		}
		this.cursor -= 1;
		this.content.splice(this.cursor, 1);
		return true;
	}

	public moveCursorRelative(characters: number): boolean {
		const newValue = this.cursor + characters;
		if (newValue < 0 || newValue > this.content.length) {
			return false;
		}
		this.cursor = newValue;
		return true;
	}

	public moveCursorStartOfLine(): boolean {
		if (this.cursor === 0) {
			return false;
		}
		this.cursor = 0;
		return true;
	}

	public moveCursorEndOfLine(): boolean {
		if (this.cursor === this.content.length) {
			return false;
		}
		this.cursor = this.content.length;
		return true;
	}

	public moveCursorWordLeft(): boolean {
		if (this.cursor === 0) {
			return false;
		}
		let index: number;
		// check if we are at the beginning of a word
		if (this.content[this.cursor - 1] === ' ') {
			index = this.cursor - 2;
			while (index > 0) {
				if (this.content[index] === ' ') {
					index--;
				} else {
					break;
				}
			}
		} else {
			index = this.cursor;
		}
		if (index === 0) {
			this.cursor = index;
			return true;
		}
		// On the first character that is not space
		while (index > 0) {
			if (this.content[index] === ' ') {
				index++;
				break;
			} else {
				index--;
			}
		}
		this.cursor = index;
		return true;
	}

	public moveCursorWordRight(): boolean {
		if (this.cursor === this.content.length) {
			return false;
		}
		let index: number;
		if (this.content[this.cursor] === ' ') {
			index = this.cursor + 1;
			while (index < this.content.length) {
				if (this.content[index] === ' ') {
					index++;
				} else {
					break;
				}
			}
		} else {
			index = this.cursor;
		}
		if (index === this.content.length) {
			this.cursor = index;
			return true;
		}

		while (index < this.content.length) {
			if (this.content[index] === ' ') {
				break;
			} else {
				index++;
			}
		}
		this.cursor = index;
		return true;
	}
}

export interface Options {
	history?: boolean;
}

class CommandHistory {

	private readonly history: string[];
	private current: number;

	constructor() {
		this.history = [''];
		this.current = 0;
	}

	public update(command: string): void {
		this.history[this.history.length - 1] = command;
	}

	public markExecuted(): void {
		// We execute a command from the history so we need to add it to the top.
		if (this.current !== this.history.length - 1) {
			this.history[this.history.length - 1] = this.history[this.current];
		}
		if (this.history[this.history.length - 1] === this.history[this.history.length - 2]) {
			this.history.pop();
		}
		this.history.push('');
		this.current = this.history.length - 1;
	}

	public previous(): string | undefined {
		if (this.current === 0) {
			return undefined;
		}
		return this.history[--this.current];
	}

	public next(): string | undefined {
		if (this.current === this.history.length - 1) {
			return undefined;
		}
		return this.history[++this.current];
	}
}

export class WasmPseudoterminalImpl implements WasmPseudoterminal {

	private readonly options: Options;
	private readonly commandHistory: CommandHistory | undefined;
	private state: PseudoterminalState;

	private readonly _onDidClose: EventEmitter<void | number>;
	public readonly onDidClose: Event<void | number>;

	private readonly _onDidWrite: EventEmitter<string>;
	public readonly onDidWrite: Event<string>;

	private readonly _onDidChangeName: EventEmitter<string>;
	public readonly onDidChangeName: Event<string>;

	private readonly _onDidCtrlC: EventEmitter<void>;
	public readonly onDidCtrlC: Event<void>;

	private readonly _onAnyKey: EventEmitter<void>;
	public readonly onAnyKey: Event<void>;

	private readonly _onDidChangeState: EventEmitter<{ old: PseudoterminalState; new: PseudoterminalState }>;
	public readonly onDidChangeState: Event<{ old: PseudoterminalState; new: PseudoterminalState }>;

	private readonly _onDidCloseTerminal: EventEmitter<void>;
	public readonly onDidCloseTerminal: Event<void>;

	// private lines: string[];
	private lineBuffer: Uint8Array;
	private readlineCallback: ((value: string ) => void) | undefined;

	private isOpen: boolean;
	private nameBuffer: string | undefined;
	private writeBuffer: string[] | undefined;
	private encoder: RAL.TextEncoder;
	private decoder: RAL.TextDecoder;

	constructor(options: Options = {}) {
		this.options = options;
		this.commandHistory = this.options.history ? new CommandHistory() : undefined;
		this.state = PseudoterminalState.busy;

		this._onDidClose = new EventEmitter();
		this.onDidClose = this._onDidClose.event;

		this._onDidWrite = new EventEmitter<string>();
		this.onDidWrite = this._onDidWrite.event;

		this._onDidChangeName = new EventEmitter<string>();
		this.onDidChangeName = this._onDidChangeName.event;

		this._onDidCtrlC = new EventEmitter<void>();
		this.onDidCtrlC = this._onDidCtrlC.event;

		this._onAnyKey = new EventEmitter<void>();
		this.onAnyKey = this._onAnyKey.event;

		this._onDidChangeState = new EventEmitter<{ old: PseudoterminalState; new: PseudoterminalState }>();
		this.onDidChangeState = this._onDidChangeState.event;

		this._onDidCloseTerminal = new EventEmitter<void>();
		this.onDidCloseTerminal = this._onDidCloseTerminal.event;

		this.encoder = RAL().TextEncoder.create();
		this.decoder = RAL().TextDecoder.create();

		// this.lines = [];
		this.lineBuffer = new Uint8Array(0);

		this.isOpen = false;
	}

	public get stdio(): Stdio {
		return {
			in: { kind: 'terminal', terminal: this },
			out: { kind: 'terminal', terminal: this },
			err: { kind: 'terminal', terminal: this }
		};
	}

	public setState(state: PseudoterminalState): void {
		const old = this.state;
		this.state = state;
		if (old !== state) {
			this._onDidChangeState.fire({ old, new: state });
		}
	}

	public getState(): PseudoterminalState {
		return this.state;
	}

	public setName(name: string): void {
		if (this.isOpen) {
			this._onDidChangeName.fire(name);
		} else {
			this.nameBuffer = name;
		}
	}

	public open(): void {
		this.isOpen = true;
		if (this.nameBuffer !== undefined) {
			this._onDidChangeName.fire(this.nameBuffer);
			this.nameBuffer = undefined;
		}
		if (this.writeBuffer !== undefined) {
			for (const item of this.writeBuffer) {
				this._onDidWrite.fire(item);
			}
			this.writeBuffer = undefined;
		}
	}

	public close(): void {
		this._onDidCloseTerminal.fire();
	}

	public async read(maxBytesToRead: number): Promise<Uint8Array> {
            let length: number = maxBytesToRead;
            if (length > this.lineBuffer.byteLength)
                length = this.lineBuffer.byteLength;
            const buf = this.lineBuffer.slice(0, length);
            const remain = this.lineBuffer.slice(length, this.lineBuffer.byteLength);
            this.lineBuffer = remain;
            return buf;
	}

	public bytesAvailable(): number {
		return this.lineBuffer.byteLength;
	}

	public write(content: string): Promise<void>;
	public write(content: Uint8Array, encoding?: 'utf-8'): Promise<number>;
	public write(content: Uint8Array | string, encoding?: 'utf-8'): Promise<void> | Promise<number> {
		if (typeof content === 'string') {
			this.writeString(content);
			return Promise.resolve();
		} else {
			this.writeString(this.decoder.decode(content.slice()));
			return Promise.resolve(content.byteLength);
		}
	}

	private writeString(str: string): void {
		if (this.isOpen) {
			this._onDidWrite.fire(str);
		} else {
			if (this.writeBuffer === undefined) {
				this.writeBuffer = [];
			}
			this.writeBuffer.push(str);
		}
	}

	public handleInput(data: string): void {
		if (this.state === PseudoterminalState.free) {
			this._onAnyKey.fire();
			return;
		}
		const dataE = this.encoder.encode(data);
		const buf2 = new Uint8Array(this.lineBuffer.byteLength + dataE.byteLength);
		buf2.set(new Uint8Array(this.lineBuffer), 0);
		buf2.set(new Uint8Array(dataE), this.lineBuffer.byteLength);
		this.lineBuffer = buf2
	}
}
