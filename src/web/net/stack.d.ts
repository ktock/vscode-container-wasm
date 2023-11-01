export declare function createStack(stackWorker: any): {
    accept: () => void;
    send: (buf: Uint8Array) => void;
    recv: (len: number) => any;
    recv_is_readable: () => any;
    wait_cert: () => Promise<Uint8Array>;
};
