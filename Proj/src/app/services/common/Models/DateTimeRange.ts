export interface IDateTimeRange {
    Start?: string | Date;
    End?: string | Date;
    RangeType: DateTimeRangeType;
}
export class DateTimeRange implements IDateTimeRange {
    Start?: string | Date;
    End?: string | Date;
    RangeType: DateTimeRangeType;
}
export enum DateTimeRangeType { None = 0, LastDay = 1, LastWeek = 2, LastThirtyDays = 3, LastMonth = 4 }