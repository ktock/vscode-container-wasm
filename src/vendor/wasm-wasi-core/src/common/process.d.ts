/// <reference path="../../typings/webAssemblyCommon.d.ts" />
import { LogOutputChannel } from 'vscode';
import type { ProcessOptions, Readable, Writable } from './api';
import type { ptr, u32 } from './baseTypes';
import { WasiService } from './service';
import { exitcode } from './wasi';
export declare abstract class WasiProcess {
    private _state;
    private readonly programName;
    protected readonly options: Omit<ProcessOptions, 'trace'> & {
        trace: LogOutputChannel | undefined;
    };
    private localDeviceDrivers;
    private resolveCallback;
    private threadIdCounter;
    private readonly fileDescriptors;
    private environmentService;
    private processService;
    private readonly preOpenDirectories;
    private virtualRootFileSystem;
    private _stdin;
    private _stdout;
    private _stderr;
    constructor(programName: string, options?: ProcessOptions);
    get stdin(): Writable | undefined;
    get stdout(): Readable | undefined;
    get stderr(): Readable | undefined;
    protected get state(): typeof this._state;
    initialize(): Promise<void>;
    run(): Promise<number>;
    protected abstract procExit(): Promise<void>;
    abstract terminate(): Promise<number>;
    protected destroyStreams(): Promise<void>;
    protected cleanupFileDescriptors(): Promise<void>;
    protected resolveRunPromise(exitCode: exitcode): void;
    protected abstract startMain(wasiService: WasiService): Promise<void>;
    protected abstract startThread(wasiService: WasiService, tid: u32, start_arg: ptr): Promise<void>;
    protected abstract threadEnded(tid: u32): Promise<void>;
    private mapWorkspaceFolder;
    private mapDirEntry;
    private handleConsole;
    private handleTerminal;
    private getTerminalDevice;
    private handleFiles;
    private handleFileDescriptor;
    private handlePipes;
}
