import { DateTimeRange } from '../../common/Models/DateTimeRange';
import { IQueryTypeTags } from './QueryTypeTags';
import { IData } from './Data';
import { IDatabaseCommon } from './DatabaseTaskCommon';

export interface IDatabaseDataQueryTask extends IDatabaseCommon {
  IdHierarchy: number;
  IdLogicDevices: number[];
  QueryTypeTags: IQueryTypeTags[];
}

export class DatabaseDataQueryTask implements IDatabaseDataQueryTask {
    IdHierarchy: number;    
    IdLogicDevices: number[];
    QueryTypeTags: IQueryTypeTags[];
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
}
