import { Fd } from "./fd";
type mixed = any;
export default class WASI {
    args: Array<string>;
    env: Array<string>;
    fds: Array<Fd>;
    inst: {
        exports: {
            memory: WebAssembly.Memory;
        };
    };
    wasiImport: {
        [key: string]: (...args: Array<any>) => mixed;
    };
    start(instance: {
        exports: {
            memory: WebAssembly.Memory;
            _start: () => mixed;
        };
    }): void;
    initialize(instance: {
        exports: {
            memory: WebAssembly.Memory;
            _initialize: () => mixed;
        };
    }): void;
    constructor(args: Array<string>, env: Array<string>, fds: Array<Fd>);
}
export {};
