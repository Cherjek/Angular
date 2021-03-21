import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IData } from '../data-query';
import { Observable } from 'rxjs';
import { IScheduleSettings } from 'src/app/modules/schedule/schedule-card/containers/models/schedule-settings';

@Injectable()
export class ScheduleTriggerService extends WebService<
  IScheduleSettings | IData
> {
  URL = 'schedule';
  triggerTypesCache: IData[] = [];

  getTriggerSettings(id: number) {
    return super.get(id + '/trigger-settings');
  }

  getTriggerTypes(id: number) {
    return super.get(id + '/trigger-types') as Observable<IData[]>;
  }

  putTriggerSettings(id: number, data: any) {
    return super.put(data, id + '/trigger-settings');
  }
}
