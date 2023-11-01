import { Event } from 'vscode';
import { Stdio, WasmPseudoterminal, PseudoterminalState } from './api';
export interface Options {
    history?: boolean;
}
export declare class WasmPseudoterminalImpl implements WasmPseudoterminal {
    private readonly options;
    private readonly commandHistory;
    private state;
    private readonly _onDidClose;
    readonly onDidClose: Event<void | number>;
    private readonly _onDidWrite;
    readonly onDidWrite: Event<string>;
    private readonly _onDidChangeName;
    readonly onDidChangeName: Event<string>;
    private readonly _onDidCtrlC;
    readonly onDidCtrlC: Event<void>;
    private readonly _onAnyKey;
    readonly onAnyKey: Event<void>;
    private readonly _onDidChangeState;
    readonly onDidChangeState: Event<{
        old: PseudoterminalState;
        new: PseudoterminalState;
    }>;
    private readonly _onDidCloseTerminal;
    readonly onDidCloseTerminal: Event<void>;
    private lineBuffer;
    private readlineCallback;
    private isOpen;
    private nameBuffer;
    private writeBuffer;
    private encoder;
    private decoder;
    constructor(options?: Options);
    get stdio(): Stdio;
    setState(state: PseudoterminalState): void;
    getState(): PseudoterminalState;
    setName(name: string): void;
    open(): void;
    close(): void;
    read(maxBytesToRead: number): Promise<Uint8Array>;
    bytesAvailable(): number;
    write(content: string): Promise<void>;
    write(content: Uint8Array, encoding?: 'utf-8'): Promise<number>;
    private writeString;
    handleInput(data: string): void;
}
