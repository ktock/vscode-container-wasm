import { CharacterDeviceDriver, DeviceId } from './deviceDriver';
import { Uri } from 'vscode';
export declare const uri: Uri;
export declare function create(deviceId: DeviceId): CharacterDeviceDriver;
