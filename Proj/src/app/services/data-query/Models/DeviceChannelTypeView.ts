
import { IDeviceChannelType, DeviceChannelType } from './DeviceChannelType';

export interface IDeviceChannelTypeView extends IDeviceChannelType {
    IsActive: boolean;
}

export class DeviceChannelTypeView extends DeviceChannelType implements IDeviceChannelTypeView {
    IsActive: boolean;
}