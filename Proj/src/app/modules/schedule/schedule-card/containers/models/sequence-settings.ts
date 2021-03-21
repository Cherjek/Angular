import { ITimeSettings } from './time-settings';

export interface ISequenceSettings {
  count: number;
  timeStart: ITimeSettings;
  timeEnd: ITimeSettings;
}

export class SequenceSettings implements ISequenceSettings {
  count: number;
  timeStart: ITimeSettings;
  timeEnd: ITimeSettings;
}
