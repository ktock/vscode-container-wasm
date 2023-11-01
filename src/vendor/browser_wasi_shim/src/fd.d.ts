import * as wasi from "./wasi_defs";
export declare class Fd {
    fd_advise(offset: number | BigInt, len: BigInt, advice: number | BigInt): number;
    fd_allocate(offset: number | BigInt, len: BigInt): number;
    fd_close(): number;
    fd_datasync(): number;
    fd_fdstat_get(): {
        ret: number;
        fdstat: wasi.Fdstat | null;
    };
    fd_fdstat_set_flags(flags: number): number;
    fd_fdstat_set_rights(fs_rights_base: BigInt, fs_rights_inheriting: BigInt): number;
    fd_filestat_get(): {
        ret: number;
        filestat: wasi.Filestat | null;
    };
    fd_filestat_set_size(size: number | BigInt): number;
    fd_filestat_set_times(atim: any, mtim: any, fst_flags: any): number;
    fd_pread(view8: Uint8Array, iovs: any, offset: number | BigInt): {
        ret: number;
        nread: number;
    };
    fd_prestat_get(): {
        ret: number;
        prestat: null;
    };
    fd_prestat_dir_name(path_ptr: number, path_len: number): {
        ret: number;
        prestat_dir_name: null;
    };
    fd_pwrite(view8: Uint8Array, iovs: any, offset: number | BigInt): {
        ret: number;
        nwritten: number;
    };
    fd_read(view8: Uint8Array, iovs: Array<wasi.Iovec>): {
        ret: number;
        nread: number;
    };
    fd_readdir_single(cookie: BigInt): {
        ret: number;
        dirent: null;
    };
    fd_seek(offset: number | BigInt, whence: any): {
        ret: number;
        offset: number;
    };
    fd_sync(): number;
    fd_tell(): {
        ret: number;
        offset: number;
    };
    fd_write(view8: any, iovs: any): {
        ret: number;
        nwritten: number;
    };
    path_create_directory(path: any): number;
    path_filestat_get(flags: any, path: any): {
        ret: number;
        filestat: null;
    };
    path_filestat_set_times(flags: any, path: any, atim: any, mtim: any, fst_flags: any): number;
    path_link(old_fd: any, old_flags: any, old_path: any, new_path: any): number;
    path_open(dirflags: any, path: any, oflags: any, fs_rights_base: any, fs_rights_inheriting: any, fdflags: any): {
        ret: number;
        fd_obj: null;
    };
    path_readlink(path: any): {
        ret: number;
        data: null;
    };
    path_remove_directory(path: any): number;
    path_rename(old_path: any, new_fd: any, new_path: any): number;
    path_symlink(old_path: any, new_path: any): number;
    path_unlink_file(path: any): number;
}
