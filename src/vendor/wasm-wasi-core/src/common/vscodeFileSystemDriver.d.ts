import { Uri } from 'vscode';
import { FileSystemDeviceDriver, DeviceId } from './deviceDriver';
export declare function create(deviceId: DeviceId, baseUri: Uri, readOnly?: boolean): FileSystemDeviceDriver;
