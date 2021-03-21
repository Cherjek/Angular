import { WebService } from 'src/app/services/common/Data.service';
import { Injectable } from '@angular/core';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';
import { PowerLevel } from './models/power-level';

@Injectable({
  providedIn: 'root',
})
export class PowerLevelService
  extends WebService<PowerLevel>
  implements IInlineGrid {
  URL = 'tariff-calc/power-level-types';
  params: any;

  read() {
    return this.get();
  }

  create(data: PowerLevel) {
    return this.post(data, this.params.id);
  }

  remove(itemId: number) {
    return this.delete(itemId);
  }
}
