import { DateTimeDepth } from '..';

export interface IDataQueryDates {
    DateRangeType: string;
    DateTimeDepth: DateTimeDepth;
    StartDate?: string | Date;
    EndDate?: string | Date;
}

export class DataQueryDates implements IDataQueryDates {
    DateRangeType: string;    
    DateTimeDepth: DateTimeDepth;
    StartDate?: string | Date;
    EndDate?: string | Date;
}