import { ITimeStampType } from './TimeStampType';
import { IDataQueryType } from './DataQueryType';
import { IValueType } from '../../common/Models/ValueType';

export interface IDeviceTagType {
    Id?: number;
    IdDeviceType: number;
    Name: string;
    Code: string;
    Ratio: number;
    Offset: number;
    ValueType: IValueType;
    TimeStampType: ITimeStampType;
    ValueMinimum?: number;
    ValueMaximum?: number;
    DataQueryType: IDataQueryType;
}

export class DeviceTagType implements IDeviceTagType {
    Id?: number;
    IdDeviceType: number;
    Name: string;
    Code: string;
    Ratio: number;
    Offset: number;
    ValueType: IValueType;
    TimeStampType: ITimeStampType;
    ValueMinimum?: number;
    ValueMaximum?: number;
    DataQueryType: IDataQueryType;
}