import { u32 } from './baseTypes';
import { errno } from './wasi';
import { WasiFunction, MemoryTransfer } from './wasiMeta';
import { WorkerMessage } from './connection';
import { WASI } from './wasi';
export declare abstract class HostConnection {
    private readonly timeout;
    constructor(timeout?: number);
    abstract postMessage(message: WorkerMessage): any;
    abstract destroy(): void;
    call(func: WasiFunction, args: (number | bigint)[], wasmMemory: ArrayBuffer, transfers?: MemoryTransfer): errno;
    private doCall;
    private createCallArrays;
}
declare namespace WebAssembly {
    interface Global {
        value: any;
        valueOf(): any;
    }
    interface Table {
        readonly length: number;
        get(index: number): any;
        grow(delta: number, value?: any): number;
        set(index: number, value?: any): void;
    }
    interface Memory {
        readonly buffer: ArrayBuffer;
        grow(delta: number): number;
    }
    type ExportValue = Function | Global | Memory | Table;
    interface Instance {
        readonly exports: Record<string, ExportValue>;
    }
    var Instance: {
        prototype: Instance;
        new (): Instance;
    };
}
export interface WasiHost extends WASI {
    initialize: (instOrMemory: WebAssembly.Instance | WebAssembly.Memory) => void;
    memory: () => ArrayBuffer;
    thread_exit: (tid: u32) => void;
}
export declare namespace WasiHost {
    function create(connection: HostConnection): WasiHost;
}
export interface Tracer {
    tracer: WasiHost;
    printSummary(): void;
}
export declare namespace TraceWasiHost {
    function create(connection: HostConnection, host: WasiHost): Tracer;
}
export {};
