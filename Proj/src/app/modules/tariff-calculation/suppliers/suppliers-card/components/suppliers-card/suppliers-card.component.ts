import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigateItem } from '../../../../../../common/models/Navigate/NavigateItem';

import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { PermissionCheckUtils } from 'src/app/core';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import { TariffSupplier } from 'src/app/services/taiff-calculation/suppliers/Models/TariffSupplier';

@Component({
  selector: 'rom-suppliers-card',
  templateUrl: './suppliers-card.component.html',
  styleUrls: ['./suppliers-card.component.less']
})
export class SuppliersCardComponent implements OnInit, OnDestroy {
  public supplierName: string;
  public supplier: TariffSupplier;
  private supplierId: string | number;
  private sub$: Subscription;
  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  public contextButtonItems: ContextButtonItem[];
  public menuItems: NavigateItem[] = [
    {
      code: 'property',
      url: 'property',
      name: AppLocalization.Properties
    },
    {
      code: 'addition',
      url: 'addition',
      name: AppLocalization.SalesAllowance,
      access: 'TC_ADDITION_VIEW'
    },
    {
      code: 'infrastructure',
      url: 'infrastructure',
      name: AppLocalization.InfrastructurePayments,
      access: 'TC_INFRASTRUCTURE_VIEW'
    },
    {
      code: 'factPeakPower',
      url: 'fact-peak-power',
      name: AppLocalization.ActualPeakHours,
      access: 'TC_FACT_PEAK_HOURS_VIEW'
    },
    {
      code: 'energyPrice',
      url: 'energy-price',
      name: AppLocalization.Label97,
      access: 'TC_ENERGY_PRICE_VIEW'
    }
  ];
  subParam$: Subscription;

  public get isNew() {
    return this.supplierId === 'new';
  }

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private suppliersService: SuppliersService
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe(param => {
      this.supplierId = param.id;
    });

    this.sub$ = this.suppliersService
      .getSupplier(this.supplierId)
      .subscribe((x: TariffSupplier) => {
        this.supplier = x;
        if (!this.isNew)
          this.supplierName = `${this.supplier.Code}, ${this.supplier.Name}`;
      });

    this.permissionCheckUtils
      .getAccess([
        'TC_SUPPLIER_DELETE'
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
      promise = this.suppliersService.delete(this.supplierId as number);
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl('/tariff-calc/suppliers');
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
}
