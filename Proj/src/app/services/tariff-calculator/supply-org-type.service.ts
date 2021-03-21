import { AppLocalization } from 'src/app/common/LocaleRes';
import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { WebService } from '../common/Data.service';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';
import { PriceCategory } from './models/price-category';
import { SupplyOrganizationType } from './models/supply-organization-type';

@Injectable({
  providedIn: 'root',
})
export class SupplyOrgTypeService
  extends WebService<SupplyOrganizationType>
  implements IInlineGrid {
  URL = 'tariff-calc/supply-organization-types';
  params: any;
  private supplyOrgColumns = [
    {
      Name: 'Code',
      Caption: AppLocalization.Code,
      IsRequired: true,
      MaxLength: 250,
    },
    {
      Name: 'Name',
      Caption: AppLocalization.Name,
      IsRequired: true,
      MaxLength: 250,
    },
  ];
  private orgsCache: SupplyOrganizationType[];
  private orgPriceCategoryMap: any = {};
  private firstPriceCategory: PriceCategory[];

  getPriceCats(id: number) {
    return this.get(`${id}/price-categories`);
  }

  read() {
    if (this.orgsCache) {
      return of(this.orgsCache);
    }
    return this.get().pipe(
      map((x: SupplyOrganizationType[]) => {
        this.orgsCache = x;
        return x;
      })
    );
  }

  getColumns() {
    return this.read().pipe(
      mergeMap((orgs: SupplyOrganizationType[]) => {
        const ids = (orgs || []).map((x) => x && x.Id);
        return forkJoin((ids || []).map((x) => x && this.getPriceCats(x)));
      }),
      map((priceCategories) => {
        this.firstPriceCategory = priceCategories[0] as PriceCategory[];
        const categoriesToColumn = (this.firstPriceCategory || []).map(
          (cat) => {
            if (cat) {
              return {
                Name: cat.Code,
                Caption: cat.Name,
                Type: 'Bool',
              };
            }
          }
        );
        (this.orgsCache || []).forEach((org, index) => {
          if (org) {
            this.orgPriceCategoryMap[org.Id] = priceCategories[index];
            (categoriesToColumn || []).forEach((cat: any) => {
              if (cat) {
                const categories = priceCategories[index] as any;
                const field = cat.Name;
                org[field] = (categories || []).find(
                  (x: any) => x && x.Code === field
                ).IsActive;
              }
            });
          }
        });

        return [...this.supplyOrgColumns, ...categoriesToColumn];
      })
    );
  }

  create(data: any) {
    const supplyOrg = {
      Id: data.Id,
      Code: data.Code,
      Name: data.Name,
    } as SupplyOrganizationType;

    const priceCat = this.firstPriceCategory;
    (priceCat || []).forEach(
      (cat: any) => cat && (cat.IsActive = data[cat.Code])
    );
    return new Promise((resolve, reject) => {
      this.post(supplyOrg, this.params.id)
        .then((id) => {
          this.post(priceCat, `${data.Id || id}/price-categories`)
            .then(() => {
              this.firstPriceCategory = null;
              this.orgsCache = null;
              resolve();
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }

  remove(itemId: number) {
    return this.delete(itemId);
  }
}
