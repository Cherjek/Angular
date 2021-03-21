import { WebService } from 'src/app/services/common/Data.service';
import { Injectable } from '@angular/core';
import { PriceZone } from './models/price-zone';

@Injectable()
export class PriceZoneService extends WebService<PriceZone> {
  URL = 'tariff-calc/price-zones';
}
