import { AppLocalization } from 'src/app/common/LocaleRes';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { ISupplierEnergyPrice } from 'src/app/services/taiff-calculation/suppliers/Models/supplier-energy-price';
import { DateTimeFormatPipe } from 'src/app/shared/rom-pipes/date-time-format.pipe';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-supplier-energy-price-card',
  templateUrl: './supplier-energy-price-card.component.html',
  styleUrls: ['./supplier-energy-price-card.component.less'],
})
export class SupplierEnergyPriceCardComponent implements OnInit, OnDestroy {
  public name: string;
  private dateFormat: DateTimeFormatPipe;
  public supplierEnergyPrice: ISupplierEnergyPrice;
  private energyPriceId: string | number;
  private sub$: Subscription;
  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  public contextButtonItems: ContextButtonItem[];
  public menuItems: NavigateItem[] = [
    {
      code: 'params',
      url: 'params',
      name: AppLocalization.KeyOptions,
    },
    {
      code: 'hour-diff',
      url: 'hour-diff',
      name: AppLocalization.Label116,
      access: 'TC_ENERGY_PRICE_PER_HOUR_VIEW'
    },
  ];
  subParam$: Subscription;
  supplierId: number;

  public get isNew() {
    return this.energyPriceId === 'new';
  }

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private suppliersService: SuppliersService
  ) {
    this.dateFormat = new DateTimeFormatPipe('ru');
  }

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.suppliersService.idSupplier = this.supplierId = param.supplierId;
      this.suppliersService.idEnergyPrice = this.energyPriceId = param.id;
    });

    this.sub$ = this.suppliersService
      .getSupplierEnergyPrice()
      .subscribe((x: ISupplierEnergyPrice) => {
        this.supplierEnergyPrice = x;
        if (!this.isNew) {
          this.name = `${this.transformDate(this.supplierEnergyPrice.Date)}`;
        }
      });

    this.permissionCheckUtils
      .getAccess([
        'TC_ENERGY_PRICE_DELETE'
      ], [
        {
          code: 'delete',
          name: AppLocalization.Delete,
          confirm: new ContextButtonItemConfirm(
            AppLocalization.DeleteConfirm,
            AppLocalization.Delete
          ),
        },
      ])
      .subscribe(result => this.contextButtonItems = result);
  }

  ngOnDestroy() {
    this.unsubscriber(this.sub$);
    this.unsubscriber(this.subParam$);
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }

  contextButtonHeaderClick(code: string) {
    this.loadingPanel = true;
    let promise: Promise<any> = null;
    let callback: any;
    if (code === 'delete') {
      promise = this.suppliersService.deleteSupplierEnergyPrice(
        this.energyPriceId as number
      );
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl(
            `tariff-calc/suppliers/${this.supplierId}/energy-price`
          );
        }
      };
    }
    promise
      .then((result: any) => {
        this.loadingPanel = false;
        callback(result);
      })
      .catch((error: any) => {
        this.loadingPanel = false;
        this.headerErrors = [error];
      });
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
