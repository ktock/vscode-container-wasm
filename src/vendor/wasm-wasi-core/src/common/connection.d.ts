/// <reference path="../../typings/webAssemblyCommon.d.ts" />
import { ptr, u32 } from './baseTypes';
export declare namespace Offsets {
    const lock_size = 4;
    const lock_index = 0;
    const method_size = 4;
    const method_index: number;
    const errno_size = 2;
    const errno_index: number;
    const params_index: number;
    const header_size: number;
}
export interface StartMainMessage {
    readonly method: 'startMain';
    readonly module: WebAssembly.Module;
    readonly memory?: WebAssembly.Memory;
    readonly trace?: boolean;
}
export declare namespace StartMainMessage {
    function is(message: ServiceMessage): message is StartMainMessage;
}
export interface StartThreadMessage {
    readonly method: 'startThread';
    readonly module: WebAssembly.Module;
    readonly memory: WebAssembly.Memory;
    readonly tid: u32;
    readonly start_arg: ptr;
    readonly trace?: boolean;
}
export declare namespace StartThreadMessage {
    function is(message: ServiceMessage): message is StartThreadMessage;
}
export type ServiceMessage = StartMainMessage | StartThreadMessage | {
    method: string;
};
export interface WorkerReadyMessage {
    readonly method: 'workerReady';
}
export declare namespace WorkerReadyMessage {
    function is(message: WorkerMessage): message is WorkerReadyMessage;
}
export interface WorkerDoneMessage {
    readonly method: 'workerDone';
}
export declare namespace WorkerDoneMessage {
    function is(message: WorkerMessage): message is WorkerReadyMessage;
}
export interface TraceMessage {
    readonly method: 'trace';
    readonly message: string;
    readonly timeTaken: number;
}
export declare namespace TraceMessage {
    function is(message: WorkerMessage): message is TraceMessage;
}
export interface TraceSummaryMessage {
    readonly method: 'traceSummary';
    readonly summary: string[];
}
export declare namespace TraceSummaryMessage {
    function is(message: WorkerMessage): message is TraceSummaryMessage;
}
export type WasiCallMessage = [SharedArrayBuffer, SharedArrayBuffer];
export declare namespace WasiCallMessage {
    function is(message: WorkerMessage): message is WasiCallMessage;
}
export type WorkerMessage = WasiCallMessage | WorkerReadyMessage | WorkerDoneMessage | TraceMessage | TraceSummaryMessage | {
    method: string;
};
