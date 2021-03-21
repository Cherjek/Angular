import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { WebService } from '../../common/Data.service';
import { IInlineGrid } from '../../common/Interfaces/IInlineGrid';
import { PerHourEnergyCosts } from './Models/per-hour-energy-costs';

@Injectable({
  providedIn: 'root',
})
export class SuppliersHourValuesService
  extends WebService<PerHourEnergyCosts>
  implements IInlineGrid {
  params: any;
  URL = `tariff-calc/suppliers`;
  read() {
    return super
      .get(
        `${this.params.supplierId}/energy-price/${this.params.id}/hour-values`
      )
      .pipe(
        map((costs: PerHourEnergyCosts[]) => {
          costs.forEach((cost, index) => {
            cost.Id = index + 1;
          });
          return costs;
        })
      );
  }

  create(data: PerHourEnergyCosts) {
    return super.post(
      [data],
      `${this.params.supplierId}/energy-price/${this.params.id}/hour-values`
    );
  }

  remove(idPerHourEnergyCosts: number) {
    return super.delete(
      idPerHourEnergyCosts,
      `${this.params.supplierId}/energy-price/${this.params.id}/hour-values`
    );
  }
}
