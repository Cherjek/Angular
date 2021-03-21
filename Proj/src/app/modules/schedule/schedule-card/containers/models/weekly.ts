import { ISettings, Settings } from './settings';
import { ITimeParamsSettings } from './timeparams-settings';

export interface IWeekly {
  FirstDate: string | Date;
  RepeatWeeks: number;
  WeekDays: number[];
  Time: ITimeParamsSettings;
}

export class Weekly implements IWeekly {
  FirstDate: string | Date;
  RepeatWeeks: number;
  WeekDays: number[];
  Time: ITimeParamsSettings;
}
