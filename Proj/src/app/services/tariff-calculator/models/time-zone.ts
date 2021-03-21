export interface ITimeZone {
  Id: number;
  Name: string;
  Code: string;
}

export class TimeZone implements ITimeZone {
  Id: number;
  Name: string;
  Code: string;
}
