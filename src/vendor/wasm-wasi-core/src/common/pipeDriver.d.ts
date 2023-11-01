import { size } from './baseTypes';
import { CharacterDeviceDriver, DeviceId } from './deviceDriver';
interface Stdin {
    read(maxBytesToRead: size): Promise<Uint8Array>;
}
interface Stdout {
    write(chunk: Uint8Array): Promise<void>;
}
export declare function create(deviceId: DeviceId, stdin: Stdin | undefined, stdout: Stdout | undefined, stderr: Stdout | undefined): CharacterDeviceDriver;
export {};
