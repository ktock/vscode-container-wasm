import * as vscode from 'vscode';
import { args_get, args_sizes_get, clockid, clock_res_get, clock_time_get, environ_get, environ_sizes_get, errno, fd_advise, fd_allocate, fd_close, fd_datasync, fd_fdstat_get, fd_fdstat_set_flags, fd_filestat_get, fd_filestat_set_size, fd_filestat_set_times, fd_pread, fd_prestat_dir_name, fd_prestat_get, fd_pwrite, fd_read, fd_readdir, fd_renumber, fd_seek, fd_sync, fd_tell, fd_write, path_create_directory, path_filestat_get, path_filestat_set_times, path_link, path_open, path_readlink, path_remove_directory, path_rename, path_symlink, path_unlink_file, poll_oneoff, proc_exit, random_get, sched_yield, sock_accept, thread_spawn, timestamp, thread_exit, tid, sock_shutdown, sock_send, sock_recv } from './wasi';
import { WorkerMessage } from './connection';
import { FileDescriptors } from './fileDescriptor';
import { DeviceDriver, FileSystemDeviceDriver } from './deviceDriver';
import { ProcessOptions } from './api';
import { DeviceDrivers } from './kernel';
import { RootFileSystemDeviceDriver } from './rootFileSystemDriver';
export declare abstract class ServiceConnection {
    private readonly wasiService;
    private readonly logChannel;
    private readonly _workerReady;
    private readonly _workerDone;
    constructor(wasiService: WasiService, logChannel?: vscode.LogOutputChannel | undefined);
    workerReady(): Promise<void>;
    workerDone(): Promise<void>;
    protected handleMessage(message: WorkerMessage): Promise<void>;
    private handleWasiCallMessage;
    private getParams;
}
export interface EnvironmentWasiService {
    args_sizes_get: args_sizes_get.ServiceSignature;
    args_get: args_get.ServiceSignature;
    environ_sizes_get: environ_sizes_get.ServiceSignature;
    environ_get: environ_get.ServiceSignature;
    fd_prestat_get: fd_prestat_get.ServiceSignature;
    fd_prestat_dir_name: fd_prestat_dir_name.ServiceSignature;
    [name: string]: (memory: ArrayBuffer, ...args: (number & bigint)[]) => Promise<errno | tid>;
}
export interface ClockWasiService {
    clock_res_get: clock_res_get.ServiceSignature;
    clock_time_get: clock_time_get.ServiceSignature;
    [name: string]: (memory: ArrayBuffer, ...args: (number & bigint)[]) => Promise<errno | tid>;
}
interface DeviceWasiService {
    fd_advise: fd_advise.ServiceSignature;
    fd_allocate: fd_allocate.ServiceSignature;
    fd_close: fd_close.ServiceSignature;
    fd_datasync: fd_datasync.ServiceSignature;
    fd_fdstat_get: fd_fdstat_get.ServiceSignature;
    fd_fdstat_set_flags: fd_fdstat_set_flags.ServiceSignature;
    fd_filestat_get: fd_filestat_get.ServiceSignature;
    fd_filestat_set_size: fd_filestat_set_size.ServiceSignature;
    fd_filestat_set_times: fd_filestat_set_times.ServiceSignature;
    fd_pread: fd_pread.ServiceSignature;
    fd_pwrite: fd_pwrite.ServiceSignature;
    fd_read: fd_read.ServiceSignature;
    fd_readdir: fd_readdir.ServiceSignature;
    fd_seek: fd_seek.ServiceSignature;
    fd_renumber: fd_renumber.ServiceSignature;
    fd_sync: fd_sync.ServiceSignature;
    fd_tell: fd_tell.ServiceSignature;
    fd_write: fd_write.ServiceSignature;
    path_create_directory: path_create_directory.ServiceSignature;
    path_filestat_get: path_filestat_get.ServiceSignature;
    path_filestat_set_times: path_filestat_set_times.ServiceSignature;
    path_link: path_link.ServiceSignature;
    path_open: path_open.ServiceSignature;
    path_readlink: path_readlink.ServiceSignature;
    path_remove_directory: path_remove_directory.ServiceSignature;
    path_rename: path_rename.ServiceSignature;
    path_symlink: path_symlink.ServiceSignature;
    path_unlink_file: path_unlink_file.ServiceSignature;
    poll_oneoff: poll_oneoff.ServiceSignature;
    sched_yield: sched_yield.ServiceSignature;
    random_get: random_get.ServiceSignature;
    sock_accept: sock_accept.ServiceSignature;
    sock_recv: sock_recv.ServiceSignature;
    sock_send: sock_send.ServiceSignature;
    sock_shutdown: sock_shutdown.ServiceSignature;
    [name: string]: (memory: ArrayBuffer, ...args: (number & bigint)[]) => Promise<errno | tid>;
}
export interface ProcessWasiService {
    proc_exit: proc_exit.ServiceSignature;
    thread_exit: thread_exit.ServiceSignature;
    'thread-spawn': thread_spawn.ServiceSignature;
    [name: string]: (memory: ArrayBuffer, ...args: (number & bigint)[]) => Promise<errno | tid>;
}
export interface WasiService extends EnvironmentWasiService, ClockWasiService, DeviceWasiService, ProcessWasiService {
}
export interface FileSystemService extends Pick<EnvironmentWasiService, 'fd_prestat_get' | 'fd_prestat_dir_name'>, DeviceWasiService {
}
export interface EnvironmentOptions extends Omit<ProcessOptions, 'args' | 'trace'> {
    args?: string[];
}
export declare namespace EnvironmentWasiService {
    function create(fileDescriptors: FileDescriptors, programName: string, preStats: IterableIterator<[string, DeviceDriver]>, options: EnvironmentOptions): EnvironmentWasiService;
}
export interface Clock {
    now(id: clockid, _precision: timestamp): bigint;
}
export declare namespace Clock {
    function create(): Clock;
}
export declare namespace ClockWasiService {
    function create(clock: Clock): ClockWasiService;
}
export interface DeviceOptions extends Pick<ProcessOptions, 'encoding' | 'net'> {
}
export declare namespace DeviceWasiService {
    function create(deviceDrivers: DeviceDrivers, fileDescriptors: FileDescriptors, clock: Clock, virtualRootFileSystem: RootFileSystemDeviceDriver | undefined, options: DeviceOptions): DeviceWasiService;
}
export interface FileSystemService extends Pick<EnvironmentWasiService, 'fd_prestat_get' | 'fd_prestat_dir_name'>, DeviceWasiService {
}
export declare namespace FileSystemService {
    function create(deviceDrivers: DeviceDrivers, fileDescriptors: FileDescriptors, virtualRootFileSystem: RootFileSystemDeviceDriver | undefined, preOpens: Map<string, FileSystemDeviceDriver>, options: DeviceOptions): FileSystemService;
}
export declare const NoSysWasiService: WasiService;
export {};
