import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { PeakHour } from './models/peak-hour';

@Injectable()
export class PeakHoursService extends WebService<PeakHour> {
  URL = 'tariff-calc/plans-peak-power';

  idPriceZone: number | string;
  idPeakHour: number | string;

  get() {
    return super.get(this.idPriceZone);
  }

  getPeakHour() {
    return super.get(`${this.idPriceZone}/${this.idPeakHour}`);
  }

  deletePeakHour(itemId: number) {
    return super.delete(itemId, `${this.idPriceZone}`);
  }

  postPeakHour(item: PeakHour) {
    item.IdTariffPriceZone = +this.idPriceZone;
    return super.post(item, `${this.idPriceZone}`);
  }
}
