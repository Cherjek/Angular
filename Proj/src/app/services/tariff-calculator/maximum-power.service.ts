import { WebService } from 'src/app/services/common/Data.service';
import { MaximumPower } from './models/maximum-power';
import { Injectable } from '@angular/core';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';

@Injectable({
  providedIn: 'root',
})
export class MaximumPowerService
  extends WebService<MaximumPower>
  implements IInlineGrid {
  URL = 'tariff-calc/max-power-types';
  params: any;

  read() {
    return this.get();
  }

  create(data: MaximumPower) {
    return this.post(data, this.params.id);
  }

  remove(itemId: number) {
    return this.delete(itemId);
  }
}
