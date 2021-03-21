import { IData } from '..';
import { DateTimeRange } from '../../common/Models/DateTimeRange';

export interface IDatabaseCommon {
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