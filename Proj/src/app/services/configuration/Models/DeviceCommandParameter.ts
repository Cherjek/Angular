import { ILogicDeviceCommandTypeParameter } from '../../commands/Models/LogicDeviceCommandTypeParameter';
import { IDeviceTypeCommandParameter } from './DeviceTypeCommandParameter';

export interface IDeviceCommandParameter {
    Id: number;
    IdDeviceCommand: number;
    LogicDeviceParameter: ILogicDeviceCommandTypeParameter;
    DeviceParameter: IDeviceTypeCommandParameter;
    FixedValue: string;
}