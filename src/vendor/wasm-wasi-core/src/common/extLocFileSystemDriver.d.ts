import { Uri } from 'vscode';
import { DeviceId, FileSystemDeviceDriver } from '../common/deviceDriver';
declare namespace Dump {
    type FileNode = {
        kind: 'file';
        name: string;
        size: string;
        ctime: string;
        atime: string;
        mtime: string;
    };
    type DirectoryNode = {
        kind: 'directory';
        name: string;
        size: string;
        ctime: string;
        atime: string;
        mtime: string;
        children: {
            [key: string]: Node;
        };
    };
    type Node = FileNode | DirectoryNode;
}
export declare function create(deviceId: DeviceId, baseUri: Uri, dump: Dump.DirectoryNode): FileSystemDeviceDriver;
export {};
