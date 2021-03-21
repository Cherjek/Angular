import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { LogicDeviceKindsService } from 'src/app/services/references/logic-device-kinds.service';
import { ILogicDeviceKind } from 'src/app/services/references/models/LogicDeviceKinds';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-logic-device-kinds-main',
  templateUrl: './logic-device-kinds-card-main.component.html',
  styleUrls: ['./logic-device-kinds-card-main.component.less']
})
export class LogicDeviceKindsCardMainComponent implements OnInit, OnDestroy {
  public deviceTypeName: string;
  public deviceType: ILogicDeviceKind;
  private deviceId: string | number;
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
      code: 'parameters',
      url: 'parameters',
      name: AppLocalization.Options
    }
  ];
  subParam$: Subscription;
  logicDeviceId: number;

  public get isNew() {
    return this.deviceId === 'new';
  }

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private logicDeviceKindsService: LogicDeviceKindsService
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe(param => {
      this.deviceId = param.id;
      this.logicDeviceId = param.logicDeviceId;
      this.logicDeviceKindsService.idLogicDevice = param.logicDeviceId;
      this.logicDeviceKindsService.idDeviceKind = param.id;
    });

    this.sub$ = this.logicDeviceKindsService
      .getDeviceKind()
      .subscribe((x: ILogicDeviceKind) => {
        this.deviceType = x;
        this.deviceTypeName = `${this.deviceType.Name}, ${this.deviceType.Code}`;
      });

    this.permissionCheckUtils
      .getAccess([
        'CFG_LOGIC_DEVICE_EDIT_KINDS'
      ], [
        {
          code: 'delete',
          name: AppLocalization.Delete,
          confirm: new ContextButtonItemConfirm(
            AppLocalization.DeleteConfirm,
            AppLocalization.Delete
          )
        }
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
      promise = this.logicDeviceKindsService.deleteDeviceKind(
        this.deviceId as number
      );
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl(
            `/references/types-logic-devices/${this.logicDeviceId}/kinds`
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
