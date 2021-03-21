import { DateTimeRange } from '../../common/Models/DateTimeRange';
import { Device } from './Device';
import { DataQueryType } from './DataQueryType';
import { IData } from './Data';
import { IDatabaseCommon } from './DatabaseTaskCommon';

export interface IDatabaseTask extends IDatabaseCommon {
  Device: Device;
  QueryType: DataQueryType;
  TagCodes: DataQueryType[];
}

export class DatabaseTask implements IDatabaseTask {
    Id: number;
    Name?: any;
    DateTimeRange: DateTimeRange;
    CreateDate: string | Date;
    StartDate?: string | Date;
    UpdateDate?: string | Date;
    FinishDate?: string | Date;
    State: IData;
    Progress: number;
    User?: any;
    TaskType: number;
    Device: Device;
    QueryType: DataQueryType;
    TagCodes: DataQueryType[];
}
