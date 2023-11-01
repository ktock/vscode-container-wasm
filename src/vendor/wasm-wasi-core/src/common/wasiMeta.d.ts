import { ptr } from './baseTypes';
export declare enum ParamKind {
    ptr = 1,
    number = 2,
    bigint = 3
}
export type NumberParam = {
    kind: ParamKind.number;
    size: number;
    write: (view: DataView, offset: number, value: number) => void;
    read: (view: DataView, offset: number) => number;
};
export type BigintParam = {
    kind: ParamKind.bigint;
    size: number;
    write: (view: DataView, offset: number, value: bigint) => void;
    read: (view: DataView, offset: number) => bigint;
};
export declare enum DataKind {
    param = 1,
    result = 2,
    both = 3
}
export type PtrParam = {
    kind: ParamKind.ptr;
    size: 4;
    write: (view: DataView, offset: number, value: number) => void;
    read: (view: DataView, offset: number) => number;
};
export type Param = PtrParam | NumberParam | BigintParam;
export type WasiFunctionSignature = {
    params: Param[];
    memorySize: number;
};
export declare namespace WasiFunctionSignature {
    function create(params: Param[]): WasiFunctionSignature;
}
export declare enum MemoryTransferDirection {
    param = 1,
    result = 2,
    both = 3
}
export type SingleReverseArgumentTransfer = {
    readonly from: ptr;
    readonly to: ptr;
    readonly size: number;
};
export type ReverseArgumentTransfer = SingleReverseArgumentTransfer | SingleReverseArgumentTransfer[] | undefined;
export type ReverseArgumentsTransfer = ReverseArgumentTransfer[];
export type ArgumentTransfer = {
    readonly memorySize: number;
    copy: (wasmMemory: ArrayBuffer, from: ptr, transferMemory: SharedArrayBuffer, to: ptr) => ReverseArgumentTransfer | undefined;
};
export type ArgumentsTransfer = {
    items: ArgumentTransfer[];
    readonly size: number;
};
export declare namespace ArgumentsTransfer {
    const Null: ArgumentsTransfer;
    function create(items: ArgumentTransfer[]): ArgumentsTransfer;
}
export type ReverseCustomTransfer = {
    copy: () => void;
};
export type CustomMemoryTransfer = {
    readonly size: number;
    copy: (wasmMemory: ArrayBuffer, args: (number | bigint)[], paramBuffer: SharedArrayBuffer, paramIndex: number, transferMemory: SharedArrayBuffer) => ReverseCustomTransfer;
};
export type MemoryTransfer = ArgumentsTransfer | CustomMemoryTransfer;
export declare namespace MemoryTransfer {
    function isCustom(transfer: MemoryTransfer | undefined): transfer is CustomMemoryTransfer;
    function isArguments(transfer: MemoryTransfer | undefined): transfer is ArgumentsTransfer;
}
export type ReverseTransfer = ReverseArgumentsTransfer | ReverseCustomTransfer;
export declare namespace ReverseTransfer {
    function isCustom(transfer: ReverseTransfer | undefined): transfer is ReverseCustomTransfer;
    function isArguments(transfer: ReverseTransfer | undefined): transfer is ReverseArgumentsTransfer;
}
export type WasiFunction = {
    readonly name: string;
    readonly signature: WasiFunctionSignature;
    transfers?: (memory: DataView, ...params: (number & bigint)[]) => ArgumentsTransfer | CustomMemoryTransfer;
};
export type WasiFunctions = {
    add(wasiFunction: WasiFunction): void;
    functionAt(index: number): WasiFunction;
    get(name: string): WasiFunction;
    getIndex(name: string): number;
    getName(index: number): string;
};
export declare const WasiFunctions: WasiFunctions;
export declare namespace U8 {
    const size: 1;
    const $ptr: PtrParam;
    const $param: NumberParam;
}
export declare const Byte: typeof U8;
export declare namespace Bytes {
    const $ptr: PtrParam;
    function createTransfer(length: number, direction: MemoryTransferDirection): ArgumentTransfer;
}
export declare namespace U16 {
    const size: 2;
    const $ptr: PtrParam;
    const $param: NumberParam;
    const $transfer: ArgumentTransfer;
}
export declare namespace U32 {
    const size: 4;
    const $ptr: PtrParam;
    const $param: NumberParam;
    const $transfer: ArgumentTransfer;
}
export declare const Size: typeof U32;
export declare namespace U64 {
    const size: 8;
    const $ptr: PtrParam;
    const $param: BigintParam;
    const $transfer: ArgumentTransfer;
}
export declare namespace S64 {
    const size: 8;
    const $ptr: PtrParam;
    const $param: BigintParam;
}
export declare namespace Ptr {
    const size: 4;
    const $param: PtrParam;
    function createTransfer(length: number, direction: MemoryTransferDirection): ArgumentTransfer;
}
