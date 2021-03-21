import { IData, Data } from '../../data-query';

export interface IScheduleTriggerSettings {
  IdSchedule: number;
  Hint: string;
  Active: boolean;
  UseDateBounds: boolean;
  StartDateTime: string;
  EndDateTime: string;
  TriggerType: IData;
}

export class ScheduleTriggerSettings extends Data
  implements IScheduleTriggerSettings {
  IdSchedule: number;
  Hint: string;
  Active: boolean;
  UseDateBounds: boolean;
  StartDateTime: string;
  EndDateTime: string;
  TriggerType: IData;
}
