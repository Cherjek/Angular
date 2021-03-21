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
import { ISupplierAddition } from 'src/app/services/taiff-calculation/suppliers/Models/supplier-addition';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-supplier-addition-card-main',
  templateUrl: './supplier-addition-card-main.component.html',
  styleUrls: ['./supplier-addition-card-main.component.less'],
})
export class SupplierAdditionCardMainComponent implements OnInit, OnDestroy {
  public additionName: string;
  public supplierAddition: ISupplierAddition;
  private additionId: string | number;
  private sub$: Subscription;
  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  public contextButtonItems: ContextButtonItem[];
  public menuItems: NavigateItem[] = [
    {
      code: 'property',
      url: 'property',
      name: AppLocalization.Properties,
    },
    {
      code: 'files',
      url: 'files',
      name: AppLocalization.Files,
    },
  ];
  subParam$: Subscription;
  supplierId: number;

  public get isNew() {
    return this.additionId === 'new';
  }

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private suppliersService: SuppliersService
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.suppliersService.idSupplier = this.supplierId = param.supplierId;
      this.suppliersService.idAddition = this.additionId = param.id;
    });

    this.sub$ = this.suppliersService
      .getSupplierAddition()
      .subscribe((x: ISupplierAddition) => {
        this.supplierAddition = x;
        if (!this.isNew) {
          this.additionName = `${this.supplierAddition.OrderNumber}`;
        }
      });
    
    this.permissionCheckUtils
      .getAccess([
        'TC_ADDITION_DELETE'
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
      promise = this.suppliersService.deleteSupplierAddition(
        this.additionId as number
      );
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl(
            `tariff-calc/suppliers/${this.supplierId}/addition`
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
}
