import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { ServiceJob } from '../common/Models/ServiceJob';
import { Observable } from 'rxjs';
import { ISchedule } from '.';

@Injectable()
export class SchedulesMainService extends WebService<ISchedule> {
  URL = 'schedules/filters';

  getSchedules(key?: string): Observable<ISchedule[]> {
    return super.get(key != null ? key : '') as Observable<ISchedule[]>;
  }
}
