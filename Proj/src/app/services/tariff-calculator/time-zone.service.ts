import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { ITimeZone } from './models/time-zone';

@Injectable()
export class TimeZoneService extends WebService<ITimeZone> {
  URL = 'tariff-calc/time-zones';
}
