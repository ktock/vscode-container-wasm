import type { WasmPseudoterminal } from './api';
import { CharacterDeviceDriver, DeviceId } from './deviceDriver';
export declare function create(deviceId: DeviceId, terminal: WasmPseudoterminal): CharacterDeviceDriver;
