import { Event } from 'vscode';
import type { Readable, Writable } from './api';
export declare class DestroyError extends Error {
    constructor();
}
export declare abstract class Stream {
    private static BufferSize;
    protected chunks: Uint8Array[];
    protected fillLevel: number;
    private awaitForFillLevel;
    private awaitForData;
    constructor();
    write(chunk: Uint8Array): Promise<void>;
    read(): Promise<Uint8Array>;
    read(mode: 'max', size: number): Promise<Uint8Array>;
    end(): void;
    destroy(): void;
    private awaitFillLevel;
    private awaitData;
    protected signalSpace(): void;
    protected signalData(): void;
}
export declare class WritableStream extends Stream implements Writable {
    private readonly encoding;
    private readonly encoder;
    constructor(encoding?: 'utf-8');
    write(chunk: Uint8Array | string): Promise<void>;
    end(): void;
}
export declare class ReadableStream extends Stream implements Readable {
    private mode;
    private readonly _onData;
    private readonly _onDataEvent;
    private timer;
    constructor();
    get onData(): Event<Uint8Array>;
    pause(flush?: boolean): void;
    resume(): void;
    read(mode?: 'max', size?: number): Promise<Uint8Array>;
    end(): void;
    protected signalData(): void;
    private emitAll;
    private triggerData;
}
