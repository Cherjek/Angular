import { IData } from './Data';
import { IDeviceChannelType } from './DeviceChannelType';

export interface IDeviceTypeCommand {
    Id: number;
    IdDeviceType?: number;
    DeviceCommandType: IData;
    DeviceChannelType: IDeviceChannelType;
}

export class DeviceTypeCommand implements IDeviceTypeCommand {
    Id: number;    
    IdDeviceType?: number;
    DeviceCommandType: IData;
    DeviceChannelType: IDeviceChannelType;
}