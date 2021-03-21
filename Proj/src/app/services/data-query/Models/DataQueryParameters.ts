import { IDateTimeRange } from '../../common/Models/DateTimeRange';
import { IQueryTypeTags } from './QueryTypeTags';

export interface IDataQueryParameters {
    DateTimeRange: IDateTimeRange;
    Name: string;
    QueryTypeTags: IQueryTypeTags[];
    PreventSave: boolean;
    LogicDevices: number[];
}

export class DataQueryParameters implements IDataQueryParameters {
    DateTimeRange: IDateTimeRange;
    Name: string;
    QueryTypeTags: IQueryTypeTags[];
    PreventSave: boolean;
    LogicDevices: number[];
    IdHierarchy: number;
}