import { Uri } from 'vscode';
import { Filetype as ApiFiletype, RootFileSystem } from './api';
import { Filetype as WasiFiletype, fd, fdflags, filetype, inode, rights } from './wasi';
import { RootFileSystemDeviceDriver } from './rootFileSystemDriver';
import { RootFileSystemInfo } from './kernel';
import { DeviceDriver, FileSystemDeviceDriver } from './deviceDriver';
import { BaseFileDescriptor, FileDescriptor, FileDescriptors } from './fileDescriptor';
export declare namespace Filetypes {
    function from(filetype: filetype): ApiFiletype;
    function to(filetype: ApiFiletype): filetype;
}
export interface BaseNode {
    readonly filetype: filetype;
    /**
     * The inode id.
     */
    readonly inode: inode;
    /**
     * The name of the file.
     */
    readonly name: string;
    /**
     * How often the node is referenced via a file descriptor
     */
    refs: number;
}
export interface FileNode extends BaseNode {
    readonly filetype: typeof WasiFiletype.regular_file;
    /**
     * The parent node
     */
    readonly parent: DirectoryNode;
}
export interface CharacterDeviceNode extends BaseNode {
    readonly filetype: typeof WasiFiletype.character_device;
    /**
     * The parent node
     */
    readonly parent: DirectoryNode;
}
export interface DirectoryNode extends BaseNode {
    readonly filetype: typeof WasiFiletype.directory;
    /**
     * The parent node
     */
    readonly parent: DirectoryNode | undefined;
    /**
     * The directory entries.
     */
    readonly entries: Map<string, Node>;
}
type Node = FileNode | DirectoryNode | CharacterDeviceNode;
export declare abstract class BaseFileSystem<D extends DirectoryNode, F extends FileNode, C extends CharacterDeviceNode> {
    private inodeCounter;
    private readonly root;
    constructor(root: D);
    protected nextInode(): inode;
    getRoot(): D;
    findNode(path: string): D | F | C | undefined;
    findNode(parent: D, path: string): D | F | C | undefined;
    private getSegmentsFromPath;
}
declare abstract class NodeDescriptor<N extends Node> extends BaseFileDescriptor {
    readonly node: N;
    constructor(deviceId: bigint, fd: fd, filetype: filetype, rights_base: rights, rights_inheriting: rights, fdflags: fdflags, inode: bigint, node: N);
    dispose(): Promise<void>;
}
export declare class FileNodeDescriptor<F extends FileNode> extends NodeDescriptor<F> {
    private _cursor;
    constructor(deviceId: bigint, fd: fd, rights_base: rights, fdflags: fdflags, inode: bigint, node: F);
    with(change: {
        fd: fd;
    }): FileDescriptor;
    get cursor(): bigint;
    set cursor(value: bigint);
}
export declare class CharacterDeviceNodeDescriptor<C extends CharacterDeviceNode> extends NodeDescriptor<C> {
    constructor(deviceId: bigint, fd: fd, rights_base: rights, fdflags: fdflags, inode: bigint, node: C);
    with(change: {
        fd: fd;
    }): FileDescriptor;
}
export declare class DirectoryNodeDescriptor<D extends DirectoryNode> extends NodeDescriptor<D> {
    constructor(deviceId: bigint, fd: fd, rights_base: rights, rights_inheriting: rights, fdflags: fdflags, inode: bigint, node: D);
    with(change: {
        fd: fd;
    }): FileDescriptor;
    childDirectoryRights(requested_rights: rights, fileOnlyBaseRights: rights): rights;
    childFileRights(requested_rights: rights, directoryOnlyBaseRights: rights): rights;
}
export declare class WasmRootFileSystemImpl implements RootFileSystem {
    private readonly deviceDrivers;
    private readonly preOpens;
    private readonly fileDescriptors;
    private readonly service;
    private virtualFileSystem;
    private singleFileSystem;
    constructor(info: RootFileSystemInfo, fileDescriptors: FileDescriptors);
    initialize(): Promise<void>;
    getDeviceDrivers(): DeviceDriver[];
    getPreOpenDirectories(): Map<string, FileSystemDeviceDriver>;
    getVirtualRootFileSystem(): RootFileSystemDeviceDriver | undefined;
    toVSCode(path: string): Promise<Uri | undefined>;
    toWasm(uri: Uri): Promise<string | undefined>;
    stat(path: string): Promise<{
        filetype: ApiFiletype;
    }>;
    private getFileDescriptor;
    private getDeviceDriver;
    private getMountPoint;
}
export {};
