import { Uri } from 'vscode';
import { DeviceDriver, DeviceId, FileSystemDeviceDriver } from './deviceDriver';
import { FileDescriptor } from './fileDescriptor';
export interface RootFileSystemDeviceDriver extends FileSystemDeviceDriver {
    makeVirtualPath(deviceDriver: FileSystemDeviceDriver, filepath: string): string | undefined;
    getDeviceDriver(path: string): [FileSystemDeviceDriver | undefined, string];
    getMountPoint(uri: Uri): [string | undefined, Uri];
}
export declare function create(deviceId: DeviceId, rootFileDescriptors: {
    getRoot(device: DeviceDriver): FileDescriptor | undefined;
}, mountPoints: Map<string, FileSystemDeviceDriver>): RootFileSystemDeviceDriver;
