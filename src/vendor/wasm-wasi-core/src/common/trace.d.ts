import { ptr, u32, u64 } from './baseTypes';
import { errno } from './wasi';
declare namespace wasi {
    type Uint32 = {
        readonly $ptr: ptr;
        value: number;
    };
    type Uint32Array = {
        readonly $ptr: ptr;
        size: number;
        get(index: number): number;
        set(index: number, value: number): void;
    };
    type Uint64 = {
        readonly $ptr: ptr;
        value: bigint;
    };
    type String = {
        readonly $ptr: ptr;
        byteLength: number;
    };
    type StringBuffer = {
        readonly $ptr: ptr;
        get value(): string;
    };
    type Bytes = {
        readonly $ptr: ptr;
        readonly byteLength: number;
    };
    type StructArray<T> = {
        readonly $ptr: ptr;
        size: number;
        get(index: number): T;
    };
}
export declare class Memory {
    private readonly raw;
    private readonly dataView;
    private readonly decoder;
    constructor(raw: ArrayBuffer);
    readUint32(ptr: ptr): u32;
    readUint32Array(ptr: ptr<u32>, size: number): wasi.Uint32Array;
    readUint64(ptr: ptr): u64;
    readStruct<T>(ptr: ptr<T>, info: {
        size: number;
        create: (memory: DataView, ptr: ptr) => T;
    }): T;
    readString(ptr: ptr, len?: number): string;
    readBytes(ptr: ptr, length: number): Uint8Array;
    private getStringLength;
}
export interface TraceMessage {
    [name: string]: (memory: ArrayBuffer, result: errno, ...args: (number & bigint)[]) => string;
}
export declare namespace TraceMessage {
    function create(): TraceMessage;
}
export {};
