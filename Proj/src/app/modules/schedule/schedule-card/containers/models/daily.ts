import { ISettings, Settings } from './settings';
import { ITimeParamsSettings } from './timeparams-settings';

export interface IDaily extends ISettings {
  FirstDate: string | Date;
  RepeatDays: number;
  Time: ITimeParamsSettings;
}

export class Daily extends Settings implements IDaily {
  FirstDate: string | Date;
  RepeatDays: number;
  Time: ITimeParamsSettings;
}
