import { IData, Data } from 'src/app/services/data-query';
import { Settings } from './settings';
import { Monthly } from './monthly';
import { Weekly } from './weekly';
import { OneTime } from './onetime';
import { Daily } from './daily';

export interface IScheduleSettings {
  Active: boolean;
  UseDateBounds: boolean;
  StartDateTime: string | Date;
  EndDateTime: string | Date;
  TriggerType?: IData;
  Monthly?: Monthly;
  Weekly?: Weekly;
  Daily?: Daily;
  OneTime?: OneTime;
}

export class ScheduleSettings implements IScheduleSettings {
  Active: boolean;
  UseDateBounds: boolean;
  StartDateTime: string | Date;
  EndDateTime: string | Date;
  TriggerType?: IData;
  Monthly?: Monthly;
  Weekly?: Weekly;
  Daily?: Daily;
  OneTime?: OneTime;
}
