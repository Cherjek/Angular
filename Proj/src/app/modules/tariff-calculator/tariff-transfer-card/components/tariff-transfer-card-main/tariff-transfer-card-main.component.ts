import { AppLocalization } from 'src/app/common/LocaleRes';
import { TariffTransferService } from 'src/app/services/tariff-calculator/tariff-transfer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { ITariffTransfer } from 'src/app/services/tariff-calculator/models/tariff-transfer';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-tariff-transfer-card-main',
  templateUrl: './tariff-transfer-card-main.component.html',
  styleUrls: ['./tariff-transfer-card-main.component.less'],
})
export class TariffTransferCardMainComponent implements OnInit, OnDestroy {
  public transferName: string;
  public tariffTransfer: ITariffTransfer;
  private tranferId: string | number;
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
      name: AppLocalization.Files
    },
  ];
  subParam$: Subscription;
  regionId: number;

  public get isNew() {
    return this.tranferId === 'new';
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private tariffTransferService: TariffTransferService,
    private permissionCheckUtils: PermissionCheckUtils
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.tranferId = param.id;
      this.regionId = param.regionId;
      this.tariffTransferService.idRegion = param.regionId;
      this.tariffTransferService.idTariffTransfer = param.id;
    });

    this.sub$ = this.tariffTransferService
      .getTariffTransfer()
      .subscribe((x: ITariffTransfer) => {
        this.tariffTransfer = x;
        if (!this.isNew) {
          this.transferName = `${this.tariffTransfer.OrderNumber}`;
        }
      });

    this.permissionCheckUtils
      .getAccess([
        'TC_TRANSFER_TARIFF_DELETE'
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
      promise = this.tariffTransferService.deleteTariffTransfer(
        this.tranferId as number
      );
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl(
            `tariff-calculator/regions/${this.regionId}/transfers`
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
