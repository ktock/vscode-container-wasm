import type { Disposable } from 'vscode';
interface _TextEncoder {
    encode(input?: string): Uint8Array;
}
interface _TextDecoder {
    decode(input?: Uint8Array): string;
}
interface RAL {
    readonly TextEncoder: {
        create(encoding?: string): _TextEncoder;
    };
    readonly TextDecoder: {
        create(encoding?: string): _TextDecoder;
    };
    readonly console: {
        info(message?: any, ...optionalParams: any[]): void;
        log(message?: any, ...optionalParams: any[]): void;
        warn(message?: any, ...optionalParams: any[]): void;
        error(message?: any, ...optionalParams: any[]): void;
    };
    readonly timer: {
        setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable;
        setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable;
        setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable;
    };
    readonly clock: {
        /**
         * Real time (since epoch) in nanoseconds
         */
        realtime(): bigint;
        /**
         * Monotonic time in nanoseconds.
         */
        monotonic(): bigint;
    };
    readonly crypto: {
        randomGet(size: number): Uint8Array;
    };
    readonly path: {
        readonly sep: string;
        basename(path: string): string;
        dirname(path: string): string;
        join(...paths: string[]): string;
        normalize(path: string): string;
        isAbsolute(path: string): boolean;
    };
}
declare function RAL(): RAL;
declare namespace RAL {
    type TextEncoder = _TextEncoder;
    type TextDecoder = _TextDecoder;
    function install(ral: RAL): void;
    function isInstalled(): boolean;
}
export default RAL;
