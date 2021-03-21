import { AppLocalization } from 'src/app/common/LocaleRes';
import { PropertyCategory } from './../../../../../services/additionally-hierarchies/Models/HierarchyNodeEdit';
import { SupplyOrganizationType } from './../../../../../services/tariff-calculator/models/supply-organization-type';
import { TariffTransfer } from './../../../../../services/tariff-calculator/models/tariff-transfer';
import { TariffTransferService } from 'src/app/services/tariff-calculator/tariff-transfer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription, forkJoin } from 'rxjs';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { TariffTransferRate } from 'src/app/services/tariff-calculator/models/tariff-transfer-rate';
import { GlobalValues, Utils } from 'src/app/core';

@Component({
  selector: 'rom-tariff-transfer-card-property',
  templateUrl: './tariff-transfer-card-property.component.html',
  styleUrls: ['./tariff-transfer-card-property.component.less'],
})
export class TariffTransferCardPropertyComponent implements OnInit, OnDestroy {
  loadingContent: boolean;
  errors: any[] = [];
  errorLoadEntity: any;
  propertyCategories: PropertyCategory[] = [];
  showHeaderPropertyEdit = true;
  isPropEdit = false;
  supplyOrgTypes: SupplyOrganizationType[];
  isBackTwo: boolean;
  propertyCatClone: PropertyCategory[];

  private transferId: number | string;
  private subscription: Subscription;
  private sub$: Subscription;

  public get isNew() {
    return this.transferId === 'new';
  }

  constructor(
    private tariffTransferService: TariffTransferService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe((param) => {
      this.transferId = param.id;
      this.tariffTransferService.idRegion = param.regionId;
      this.tariffTransferService.idTariffTransfer = param.id;

      this.loadData();
    });
  }

  ngOnInit() {
    if (this.isNew) {
      this.isPropEdit = true;
    }
  }

  ngOnDestroy() {
    this.unsubscriber([this.subscription, this.sub$]);
  }

  private loadData() {
    this.loadingContent = true;
    this.propertyCategories = [];
    this.sub$ = forkJoin([
      this.tariffTransferService.getTariffTransfer(),
      this.tariffTransferService.getSupplyOrg(),
    ])
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: [TariffTransfer, SupplyOrganizationType[]]) => {
          const tarrifData = data[0];
          this.supplyOrgTypes = data[1];
          if (this.isNew) {
            tarrifData.Date = new Date(Date.now()).toLocaleDateString();
            tarrifData.OrderDate = new Date(Date.now()).toLocaleDateString();
          }
          if (tarrifData) {
            this.initProperties(tarrifData);
            const obj = {
              OneRate: {
                name: AppLocalization.Label39,
                rates: tarrifData.OneRate,
              },
              TwoRatesUpkeep: {
                name:
                  AppLocalization.TariffCalcLabel1,
                rates: tarrifData.TwoRatesUpkeep,
              },
              TwoRatesConsumption: {
                name:
                AppLocalization.TariffCalcLabel2,
                rates: tarrifData.TwoRatesConsumption,
              },
            };
            const ratesData = Object.keys(obj).map((key) => {
              return this.transformRate(key, obj[key]);
            });
            this.propertyCategories = this.propertyCategories.concat(ratesData);
            this.propertyCatClone = this.propertyCategories.map((propCat) => ({
              ...propCat,
              Properties: propCat.Properties.map((x) => ({ ...x })),
            }));
          }
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(tariffTransfer: TariffTransfer) {
    this.propertyCategories.push({
      Name: 'Cвойства',
      Code: '',
      Properties: [
        {
          Code: 'OrderNumber',
          Name: AppLocalization.OrderNumb,
          Type: 'String',
          Value: tariffTransfer.OrderNumber,
          IsRequired: true,
        },
        {
          Code: 'Date',
          Name: AppLocalization.TariffsStartDate,
          Type: 'Date',
          Value: tariffTransfer.Date,
          IsRequired: true,
        },
        {
          Code: 'OrderDate',
          Name: AppLocalization.TheDateOfTheOrder,
          Type: 'Date',
          Value: tariffTransfer.OrderDate,
          IsRequired: true,
        },
        {
          Code: 'SupplyOrganizationType',
          Name: AppLocalization.SupplyOrganizationType,
          Type: 'Option',
          Value: tariffTransfer.SupplyOrganizationType,
          IsRequired: true,
        },
      ],
    });
  }

  public save() {
    this.errors = [];
    const rates = {};
    this.propertyCategories.forEach((propCat) => {
      if (propCat.Code) {
        rates[propCat.Code] = this.convertRateToSave(propCat.Properties as any);
      }
    });
    const mainProp = this.propertyCategories.find((x) => !x.Code);
    const tariffTransfer = new TariffTransfer();
    if (!this.isNew) {
      tariffTransfer.Id = this.transferId as number;
    }
    mainProp.Properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      tariffTransfer[prop.Code] = prop.Value;
    });
    if (!tariffTransfer.Date) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.TariffsStartDate}"`];
      return;
    }
    if (!tariffTransfer.OrderDate) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.TheDateOfTheOrder}"`];
      return;
    }
    if (!tariffTransfer.OrderNumber) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.OrderNumb}"`];
      return;
    }
    if (!tariffTransfer.SupplyOrganizationType) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.SupplyOrganizationType}"`];
      return;
    }
    tariffTransfer.Date = Utils.DateConvert.toDateTimeRequest(
      tariffTransfer.Date
    );
    tariffTransfer.OrderDate = Utils.DateConvert.toDateTimeRequest(
      tariffTransfer.OrderDate
    );
    this.loadingContent = true;
    const result = { ...tariffTransfer, ...rates };
    this.tariffTransferService
      .postTariffTransfer(result)
      .then((transferId) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + transferId], {
            relativeTo: this.activatedRoute,
          });
        } else {
          this.loadData();
        }

        this.cancelChangeProperty();
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  public back2Objects() {
    if (this.isNew && this.isBackTwo) {
      GlobalValues.Instance.Page.backwardButton.popLastUrl();
    }
    GlobalValues.Instance.Page.backwardButton.navigate();
  }

  public cancel() {
    this.errors = [];
    if (this.isNew) {
      if (this.isNew) {
        this.router.navigate(['../../'], {
          relativeTo: this.activatedRoute,
        });
      }
    } else {
      this.rollBackProperty();
      this.cancelChangeProperty();
    }
  }

  public changeProperties() {
    this.isPropEdit = true;
  }

  private unsubscriber(subs: Subscription[]) {
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  private getClone() {
    return this.propertyCatClone.map((propCat) => ({
      ...propCat,
      Properties: propCat.Properties.map((x) => ({ ...x })),
    }));
  }

  private rollBackProperty() {
    this.propertyCategories = this.getClone();
  }

  private cancelChangeProperty() {
    this.isPropEdit = false;
  }

  private transformRate(
    code: string,
    data: { name: string; rates: TariffTransferRate[] }
  ) {
    const propCat = {
      Name: data.name,
      Code: code,
      Properties: (data.rates || []).map((rate) => {
        if (rate) {
          return {
            Code: rate.PowerLevelType.Code,
            Name: rate.PowerLevelType.Name,
            Id: rate.PowerLevelType.Id,
            Type: 'Float',
            Value: rate.Value,
          } as RateView;
        } else return [];
      }),
    } as PropertyCategory;
    return propCat;
  }

  private convertRateToSave(entityProps: RateView[]) {
    return entityProps.map((prop) => {
      return {
        PowerLevelType: {
          Id: prop.Id,
          Name: prop.Name,
          Code: prop.Code,
        },
        Value: prop.Value,
      } as TariffTransferRate;
    });
  }
}

class RateView {
  Id: number;
  Name: string;
  Type: string;
  Value: number;
  Code: string;
}
