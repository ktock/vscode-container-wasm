import * as wasi from "./wasi_defs";
export declare class File {
    data: Uint8Array;
    constructor(data: ArrayBuffer | Uint8Array | Array<number>);
    get size(): number;
    stat(): wasi.Filestat;
    truncate(): void;
}
export declare class Directory {
    contents: {
        [key: string]: File | Directory;
    };
    constructor(contents: {
        [key: string]: File | Directory;
    });
    stat(): wasi.Filestat;
    get_entry_for_path(path: string): File | Directory | null;
    create_entry_for_path(path: string): File | Directory;
}
