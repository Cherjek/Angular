import { LogicDeviceCommandTypeParameterOption } from '../../commands/Models/LogicDeviceCommandTypeParameterOption';
import { DeviceTypeCommandParameterOption } from './DeviceTypeCommandParameterOption';

export interface IDeviceCommandParameterOption {
    Id?: number;
    IdDeviceCommandParameter: number;
    LogicDeviceOption: LogicDeviceCommandTypeParameterOption;
    DeviceOption: DeviceTypeCommandParameterOption;
    FixedValue: string;
}