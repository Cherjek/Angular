import { ITimeSettings } from './time-settings';

export interface ITimeParamsSettings {
  EndTime: string | Date;
  OneTime: boolean;
  RepeatCount: number;
  RunTime: string | Date;
  StartTime: string | Date;
  RepeatType: string;
}

export class TimeParamsSettings implements ITimeParamsSettings {
  EndTime: string | Date;
  OneTime: boolean;
  RepeatCount: number;
  RunTime: string | Date;
  StartTime: string | Date;
  RepeatType: string;
}
