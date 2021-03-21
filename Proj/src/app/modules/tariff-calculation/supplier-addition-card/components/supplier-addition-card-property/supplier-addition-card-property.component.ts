import { AppLocalization } from 'src/app/common/LocaleRes';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import { SupplierAddition } from './../../../../../services/taiff-calculation/suppliers/Models/supplier-addition';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { Utils } from 'src/app/core';
import { DateTimeFormatPipe } from 'src/app/shared/rom-pipes/date-time-format.pipe';
import { IData } from 'src/app/services/configuration/Models/Data';

@Component({
  selector: 'rom-supplier-addition-card-property',
  templateUrl: './supplier-addition-card-property.component.html',
  styleUrls: ['./supplier-addition-card-property.component.less'],
})
export class SupplierAdditionCardPropertyComponent
  implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;
  private dateFormat: DateTimeFormatPipe;
  private idAddition: number | string;
  private subscription: Subscription;
  private dataValues: { MaxPowerType: IData }[];
  sub$: Subscription;

  public get isNew() {
    return this.idAddition === 'new';
  }
  public properties: IEntityViewProperty[];

  constructor(
    private suppliersService: SuppliersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe((param) => {
      this.suppliersService.idSupplier = param.supplierId;
      this.suppliersService.idAddition = this.idAddition = param.id;

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
      .getSupplierAddition()
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: SupplierAddition) => {
          const obj = {} as any;
          this.dataValues = data.Values;
          (data.Values || []).forEach((addition) => {
            const maxPowType = addition.MaxPowerType;
            obj[maxPowType.Code] = addition.Value;
          });
          const result = { ...data, ...obj };
          this.initProperties(result);
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(addition: any) {
    this.properties = [
      {
        Code: 'OrderNumber',
        Name: AppLocalization.OrderNumb,
        Type: 'String',
        Value: addition.OrderNumber,
        IsRequired: true,
        IsNullName: AppLocalization._no_,
      },
      {
        Code: 'Date',
        Name: AppLocalization.StartActionDate,
        Type: 'Date',
        Value: this.excludeTime(addition.Date),
        IsRequired: true,
      },
      {
        Code: 'OrderDate',
        Name: AppLocalization.TheDateOfTheOrder,
        Type: 'Date',
        Value: this.excludeTime(addition.OrderDate),
        IsRequired: true,
      },
      {
        Code: 'LessThan670',
        Name: AppLocalization.LessThan670MvtRub,
        Type: 'Float',
        Value: addition.LessThan670,
      },
      {
        Code: '670-10',
        Name: AppLocalization.From670To10MvtRub,
        Type: 'Float',
        Value: addition['670-10'],
      },
      {
        Code: 'MoreThan10',
        Name: AppLocalization.More10MvtRub,
        Type: 'Float',
        Value: addition.MoreThan10,
      },
    ];
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const supplierAddition = new SupplierAddition();
    if (!this.isNew) {
      supplierAddition.Id = this.idAddition as number;
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
    if (!supplierAddition.OrderDate) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.TheDateOfTheOrder}"`];
      return;
    }
    if (!supplierAddition.OrderNumber) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.OrderNumb}"`];
      return;
    }
    supplierAddition.Date = Utils.DateConvert.toDateTimeRequest(
      supplierAddition.Date
    );
    supplierAddition.OrderDate = Utils.DateConvert.toDateTimeRequest(
      supplierAddition.OrderDate
    );
    this.transformToSave(supplierAddition);
    this.loadingContent = true;
    this.suppliersService
      .postSupplierAddition(supplierAddition)
      .then((idAddition) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + idAddition], {
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

  private transformToSave(addition: any) {
    addition.Values = [];
    this.dataValues.forEach((data) => {
      const maxPowType = data.MaxPowerType;
      addition.Values.push({
        MaxPowerType: {
          ...maxPowType,
        },
        Value: +addition[maxPowType.Code] || null,
      });
      delete addition[maxPowType.Code];
    });
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }

  private excludeTime(date: any) {
    const dateTransform = this.dateFormat.transform(date);
    return date.substr(0, dateTransform.length - 6).replace(/-/gi,'.');
  }
}
