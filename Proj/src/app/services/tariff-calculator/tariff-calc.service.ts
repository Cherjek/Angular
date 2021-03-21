import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { WebService } from '../common/Data.service';

@Injectable()
export class TariffCalcService extends WebService<any> {
  URL = 'tariff-calc';
  idSupplyOrgType: number;

  getSuppliers() {
    return super.get('suppliers');
  }

  getSupplyOrgs() {
    return super.get('supply-organization-types');
  }

  getPriceCategories() {
    if (this.idSupplyOrgType) {
      return super
        .get(
          `supply-organization-types/${this.idSupplyOrgType}/price-categories`
        )
        .pipe(
          map((data) => {
            const result = data.filter((x: any) => x.IsActive);
            return result;
          })
        );
    }
    return of([]);
  }
}
