import { IDeviceInfo } from './DeviceInfo';
import { IDeviceTypeCommand } from './DeviceTypeCommand';

export interface IDeviceCommand {
    Id?: number;
    IdLogicDeviceCommand: number;
    Device: IDeviceInfo;
    DeviceTypeCommand: IDeviceTypeCommand;
}