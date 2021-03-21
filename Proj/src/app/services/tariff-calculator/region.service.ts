import { WebService } from './../common/Data.service';
import { Injectable } from '@angular/core';
import { Region } from './models/region';

@Injectable()
export class RegionService extends WebService<Region> {
  URL = 'tariff-calc/regions';
}
