import * as wasi from "./wasi_defs";
import { File, Directory } from "./fs_core";
import { Fd } from "./fd";
export declare class OpenFile extends Fd {
    file: File;
    file_pos: BigInt;
    constructor(file: File);
    fd_fdstat_get(): {
        ret: number;
        fdstat: wasi.Fdstat | null;
    };
    fd_read(view8: Uint8Array, iovs: Array<wasi.Iovec>): {
        ret: number;
        nread: number;
    };
    fd_seek(offset: number | BigInt, whence: number): {
        ret: number;
        offset: number;
    };
    fd_write(view8: Uint8Array, iovs: Array<wasi.Ciovec>): {
        ret: number;
        nwritten: number;
    };
    fd_filestat_get(): {
        ret: number;
        filestat: wasi.Filestat;
    };
}
export declare class OpenDirectory extends Fd {
    dir: Directory;
    constructor(dir: Directory);
    fd_fdstat_get(): {
        ret: number;
        fdstat: wasi.Fdstat | null;
    };
    fd_readdir_single(cookie: BigInt): {
        ret: number;
        dirent: wasi.Dirent | null;
    };
    path_filestat_get(flags: number, path: string): {
        ret: number;
        filestat: wasi.Filestat | null;
    };
    path_open(dirflags: number, path: string, oflags: number, fs_rights_base: BigInt, fs_rights_inheriting: BigInt, fd_flags: number): {
        ret: number;
        fd_obj: Fd | null;
    };
}
export declare class PreopenDirectory extends OpenDirectory {
    prestat_name: Uint8Array;
    constructor(name: string, contents: {
        [key: string]: File | Directory;
    });
    fd_prestat_get(): {
        ret: number;
        prestat: wasi.Prestat;
    };
    fd_prestat_dir_name(): {
        ret: number;
        prestat_dir_name: Uint8Array;
    };
}
