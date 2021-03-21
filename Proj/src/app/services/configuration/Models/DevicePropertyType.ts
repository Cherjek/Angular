import { IValueType } from '../../common/Models/ValueType';

export interface IDevicePropertyType {
    Id: number;
    Name: string;
    Code: string;
    ValueType: IValueType;
    BoolTrue: string;
    BoolFalse: string;
    NumberDecimalDigits: number;
}