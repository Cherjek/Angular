import { AppLocalization } from 'src/app/common/LocaleRes';
import { SupplierEnergyPrice } from 'src/app/services/taiff-calculation/suppliers/Models/supplier-energy-price';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { Utils } from 'src/app/core';
import { DateTimeFormatPipe } from 'src/app/shared/rom-pipes/date-time-format.pipe';

@Component({
  selector: 'rom-supplier-energy-price-card-params',
  templateUrl: './supplier-energy-price-card-params.component.html',
  styleUrls: ['./supplier-energy-price-card-params.component.less'],
})
export class SupplierEnergyPriceCardParamsComponent
  implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;
  private dateFormat: DateTimeFormatPipe;
  private idEnergyPrice: number | string;
  private subscription: Subscription;
  sub$: Subscription;

  public get isNew() {
    return this.idEnergyPrice === 'new';
  }
  public properties: IEntityViewProperty[];

  constructor(
    private suppliersService: SuppliersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe((param) => {
      this.suppliersService.idSupplier = param.supplierId;
      this.suppliersService.idEnergyPrice = this.idEnergyPrice = param.id;

      this.dateFormat = new DateTimeFormatPipe('ru');

      this.loadData();
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.sub$);
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = this.suppliersService
      .getSupplierEnergyPrice()
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: SupplierEnergyPrice) => {
          this.initProperties(data);
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(energyPrice: SupplierEnergyPrice) {
    this.properties = [
      {
        Code: 'Date',
        Name: AppLocalization.Date,
        Type: 'Date',
        Value: this.transformDate(energyPrice.Date),
        IsMonthMode: true,
        IsTimeShow: false,
        IsRequired: true,
      },
      {
        Code: 'RetailCost',
        Name: AppLocalization.CostBuyOnMarketMvtRub,
        Type: 'Float',
        Value: energyPrice.RetailCost,
      },
      {
        Code: 'Pc1AvgCost',
        Name: AppLocalization.AproxCostFirstPriceCatMvtRub,
        Type: 'Float',
        Value: energyPrice.Pc1AvgCost,
      },
      {
        Code: 'NightZoneCost',
        Name: AppLocalization.Label93,
        Type: 'Float',
        Value: energyPrice.NightZoneCost,
      },
      {
        Code: 'DayZoneCost',
        Name: AppLocalization.Label92,
        Type: 'Float',
        Value: energyPrice.DayZoneCost,
      },
      {
        Code: 'HalfPeakZoneCost',
        Name: AppLocalization.Label95,
        Type: 'Float',
        Value: energyPrice.HalfPeakZoneCost,
      },
      {
        Code: 'PeakZoneCost',
        Name: AppLocalization.Label94,
        Type: 'Float',
        Value: energyPrice.PeakZoneCost,
      },      
      {
        Code: 'PowerAvgCost',
        Name:
          AppLocalization.Label90,
        Type: 'Float',
        Value: energyPrice.PowerAvgCost,
      },
      {
        Code: 'ProposalDiffCost',
        Name:
          AppLocalization.Label73,
        Type: 'Float',
        Value: energyPrice.ProposalDiffCost,
      },
      {
        Code: 'ProposalDiffBalanceCost',
        Name:
          AppLocalization.Label72,
        Type: 'Float',
        Value: energyPrice.ProposalDiffBalanceCost,
      },
    ];
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const supplierAddition = new SupplierEnergyPrice();
    if (!this.isNew) {
      supplierAddition.Id = this.idEnergyPrice as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      supplierAddition[prop.Code] = prop.Value;
    });
    if (!supplierAddition.Date) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.TariffsStartDate}"`];
      return;
    }
    supplierAddition.Date = Utils.DateConvert.toDateTimeRequest(
      supplierAddition.Date
    );
    this.loadingContent = true;
    this.suppliersService
      .postSupplierEnergyPrice(supplierAddition)
      .then((idEnergyPrice) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + idEnergyPrice], {
            relativeTo: this.activatedRoute,
          });
        } else {
          this.loadData();
        }

        propControl.cancelChangeProperty();
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }

  private transformDate(date: any) {
    if (date) {
      const dateTransform = this.dateFormat.transform(date);
      return (date.substr(0, dateTransform.length - 9) as string).replace(
        '-',
        '.'
      );
    }
  }
}
