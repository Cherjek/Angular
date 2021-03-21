import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { DayZone } from './models/day-zone';

@Injectable()
export class DayZonesService extends WebService<DayZone> {
  URL = 'tariff-calc/day-zones';

  idOes: number | string;
  idDayZone: number | string;

  get() {
    return super.get(this.idOes);
  }

  getDayZone() {
    return super.get(`${this.idOes}/${this.idDayZone}`);
  }

  deleteDayZone(itemId: number) {
    return super.delete(itemId, `${this.idOes}`);
  }

  postDayZone(item: DayZone) {
    item.IdTariffOes = +this.idOes;
    return super.post(item, `${this.idOes}`);
  }
}
