import { Uri } from 'vscode';
import type { ExtensionLocationDescriptor, MemoryFileSystemDescriptor, VSCodeFileSystemDescriptor, MountPointDescriptor } from './api';
import type { DeviceDriver, DeviceId, FileSystemDeviceDriver } from './deviceDriver';
import type { FileDescriptors } from './fileDescriptor';
import * as vrfs from './rootFileSystemDriver';
export interface DeviceDrivers {
    add(driver: DeviceDriver): void;
    has(id: DeviceId): boolean;
    hasByUri(uri: Uri): boolean;
    get(id: DeviceId): DeviceDriver;
    getByUri(uri: Uri): DeviceDriver;
    remove(id: DeviceId): void;
    removeByUri(uri: Uri): void;
    size: number;
    values(): IterableIterator<DeviceDriver>;
    entries(): IterableIterator<[bigint, DeviceDriver]>;
    [Symbol.iterator](): IterableIterator<[bigint, DeviceDriver]>;
}
declare class DeviceDriversImpl {
    private readonly devices;
    private readonly devicesByUri;
    constructor();
    add(driver: DeviceDriver): void;
    has(id: DeviceId): boolean;
    hasByUri(uri: Uri): boolean;
    get(id: DeviceId): DeviceDriver;
    getByUri(uri: Uri): DeviceDriver;
    remove(id: DeviceId): void;
    removeByUri(uri: Uri): void;
    get size(): number;
    values(): IterableIterator<DeviceDriver>;
    entries(): IterableIterator<[bigint, DeviceDriver]>;
    [Symbol.iterator](): IterableIterator<[bigint, DeviceDriver]>;
}
export declare enum ManageKind {
    no = 1,
    yes = 2,
    default = 3
}
export interface SingleFileSystemInfo {
    kind: 'single';
    fileSystem: FileSystemDeviceDriver;
    deviceDrivers: DeviceDrivers;
    preOpens: Map<string, FileSystemDeviceDriver>;
}
export interface VirtualFileSystemInfo {
    kind: 'virtual';
    fileSystem: vrfs.RootFileSystemDeviceDriver;
    deviceDrivers: DeviceDrivers;
    preOpens: Map<string, FileSystemDeviceDriver>;
}
export type RootFileSystemInfo = SingleFileSystemInfo | VirtualFileSystemInfo;
declare namespace WasiKernel {
    function nextDeviceId(): bigint;
    function getOrCreateFileSystemByDescriptor(deviceDrivers: DeviceDrivers, descriptor: VSCodeFileSystemDescriptor | ExtensionLocationDescriptor | MemoryFileSystemDescriptor): Promise<FileSystemDeviceDriver>;
    function createRootFileSystem(fileDescriptors: FileDescriptors, descriptors: MountPointDescriptor[]): Promise<RootFileSystemInfo>;
    const deviceDrivers: DeviceDriversImpl;
    const console: import("./deviceDriver").CharacterDeviceDriver;
    function createLocalDeviceDrivers(): DeviceDrivers;
}
export default WasiKernel;
