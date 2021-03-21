import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { TariffHistoryService } from 'src/app/services/tariff-calculator/tariff-history.service';
import { ILogicDeviceTariffHistory } from 'src/app/services/tariff-calculator/models/logic-device-tariff-history';
import { PermissionCheckUtils, Utils } from 'src/app/core';

@Component({
  selector: 'rom-logic-device-tariff-history-card-main',
  templateUrl: './logic-device-tariff-history-card-main.component.html',
  styleUrls: ['./logic-device-tariff-history-card-main.component.less'],
})
export class LogicDeviceTariffHistoryCardMainComponent
  implements OnInit, OnDestroy {
  public historyDate: string;
  public history: ILogicDeviceTariffHistory;
  private historyId: string | number;
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
  ];
  subParam$: Subscription;
  logicDeviceId: number;

  public get isNew() {
    return this.historyId === 'new';
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private tariffHistoryService: TariffHistoryService,
    private permissionCheckUtils: PermissionCheckUtils
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.historyId = param.id;
      this.logicDeviceId = param.logicDeviceId;
      this.tariffHistoryService.idLogicDevice = param.logicDeviceId;
      this.tariffHistoryService.idLogicDeviceHistory = param.id;
    });

    this.sub$ = this.tariffHistoryService
      .getLogicDeviceHistory()
      .subscribe((x: ILogicDeviceTariffHistory) => {
        this.history = x;
        if (!this.isNew) {
          this.historyDate = `${Utils.DateFormat.Instance.getDate(
            this.history.StartDate
          )}`;
        }
      });

    this.permissionCheckUtils
      .getAccess([
        'TC_LOGIC_DEVICE_TARIFF_DELETE'
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
      promise = this.tariffHistoryService.deleteLogicDeviceHistory(
        this.historyId as number
      );
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl(`ld-editor/${this.logicDeviceId}/tariff`);
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
