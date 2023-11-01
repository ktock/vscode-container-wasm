import { Uri } from 'vscode';
import { MemoryFileSystem as ApiMemoryFileSystem, Readable, Writable } from './api';
import { DeviceId, FileSystemDeviceDriver } from './deviceDriver';
import { inode } from './wasi';
import { size } from './baseTypes';
import * as fs from './fileSystem';
import { ReadableStream, WritableStream } from './streams';
interface BaseNode {
    readonly ctime: bigint;
    readonly mtime: bigint;
    readonly atime: bigint;
}
interface FileNode extends fs.FileNode, BaseNode {
    readonly parent: DirectoryNode;
    content: Uint8Array | {
        size: bigint;
        reader: () => Promise<Uint8Array>;
    };
}
declare namespace FileNode {
    function create(parent: DirectoryNode, inode: inode, name: string, time: bigint, content: Uint8Array | {
        size: bigint;
        reader: () => Promise<Uint8Array>;
    }): FileNode;
    function size(node: FileNode): bigint;
}
interface DirectoryNode extends BaseNode, fs.DirectoryNode {
    readonly parent: DirectoryNode | undefined;
    readonly entries: Map<string, Node>;
}
declare namespace DirectoryNode {
    function create(parent: DirectoryNode | undefined, id: inode, name: string, time: bigint): DirectoryNode;
    function size(node: DirectoryNode): bigint;
}
interface CharacterDeviceNode extends fs.CharacterDeviceNode, BaseNode {
    readonly readable: ReadableStream | undefined;
    readonly writable: WritableStream | undefined;
}
declare namespace CharacterDeviceNode {
    function create(parent: DirectoryNode, inode: inode, name: string, time: bigint, readable: ReadableStream | undefined, writable: WritableStream | undefined): CharacterDeviceNode;
}
type Node = FileNode | DirectoryNode | CharacterDeviceNode;
export declare class MemoryFileSystem extends fs.BaseFileSystem<DirectoryNode, FileNode, CharacterDeviceNode> implements ApiMemoryFileSystem {
    readonly uri: Uri;
    constructor();
    createDirectory(path: string): void;
    createFile(path: string, content: Uint8Array | {
        size: bigint;
        reader: () => Promise<Uint8Array>;
    }): void;
    createReadable(path: string): Readable;
    createWritable(path: string, encoding?: 'utf-8'): Writable;
    private getDirectoryNode;
    readFile(node: FileNode, offset: bigint, buffers: Uint8Array[]): Promise<size>;
    readCharacterDevice(node: CharacterDeviceNode & {
        writable: WritableStream;
    }, buffers: Uint8Array[]): Promise<size>;
    writeFile(node: FileNode, offset: bigint, buffers: Uint8Array[]): Promise<size>;
    writeCharacterDevice(node: CharacterDeviceNode & {
        readable: ReadableStream;
    }, buffers: Uint8Array[]): Promise<size>;
    getContent(node: FileNode): Promise<Uint8Array>;
    private read;
    private write;
}
export declare function create(deviceId: DeviceId, memfs: MemoryFileSystem): FileSystemDeviceDriver;
export {};
