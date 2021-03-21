import { IData } from 'src/app/services/data-query';
import { ITimeParamsSettings } from './timeparams-settings';

export interface IMonthly {
  Months: number[];
  durationType: IData;
  Days: number[];
  Time: ITimeParamsSettings;
  ByDays: boolean;
  WeekDays: number[];
  Weeks: number[];
}

export class Monthly implements IMonthly {
  Months: number[];
  durationType: IData;
  Days: number[];
  Time: ITimeParamsSettings;
  ByDays: boolean;
  WeekDays: number[];
  Weeks: number[];
}
