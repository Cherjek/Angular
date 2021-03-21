import { IData } from './Data';
import { IValueType } from '../../common/Models/ValueType';

export interface IDeviceTypeCommandParameter extends IData {
    IdDeviceTypeCommand: number;
    DefaultValue: string;
    ValueType: IValueType;
}

export class DeviceTypeCommandParameter implements IDeviceTypeCommandParameter {
    Id?: number;
    IdDeviceTypeCommand: number;
    Name: string;
    Code: string;
    DefaultValue: string;
    ValueType: IValueType;
}