import { IValueType } from '../../common/Models/ValueType';

export interface Command {
    Id: number;
    Name: string;
    Code: string;
}

export interface Option {
    Id: number;
    IdLogicDeviceCommandTypeParameter: number;
    Value: string;
    Text: string;
}

export interface Parameter {
    Value?: any;
    Id: number;
    IdLogicDeviceCommandType: number;
    Code: string;
    Name: string;
    ValueType: IValueType;
    MinimumValue: number;
    MaximumValue: number;
    Options: Option[];
}

export interface CommandType {
    Id: number;
    Name: string;
    Command: Command;
    Parameters: Parameter[];
}