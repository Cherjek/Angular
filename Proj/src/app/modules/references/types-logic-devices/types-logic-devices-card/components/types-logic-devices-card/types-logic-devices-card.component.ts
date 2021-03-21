import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigateItem } from '../../../../../../common/models/Navigate/NavigateItem';

import { IDeviceType } from '../../../../../../services/data-query';
import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { LogicDeviceTypesService } from 'src/app/services/configuration/logic-device-types.service';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-types-logic-devices-card',
  templateUrl: './types-logic-devices-card.component.html',
  styleUrls: ['./types-logic-devices-card.component.less']
})
export class TypesLogicDevicesCardComponent implements OnInit, OnDestroy {
  public deviceTypeName: string;
  public deviceType: IDeviceType;
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
      code: 'tag-groups',
      url: 'tag-groups',
      name: AppLocalization.TagGroups,
      access: 'CFG_LOGIC_DEVICE_VIEW_TAG_GROUPS'
    },
    {
      code: 'tags',
      url: 'tags',
      name: AppLocalization.Tags,
      access: 'CFG_LOGIC_DEVICE_VIEW_TAGS'
    },
    {
      code: 'kinds',
      url: 'kinds',
      name: AppLocalization.EquipmentKinds,
      access: 'CFG_LOGIC_DEVICE_VIEW_KINDS'
    }
  ];
  subParam$: Subscription;

  public get isNew() {
    return this.deviceId === 'new';
  }

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private logicDeviceTypesService: LogicDeviceTypesService
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe(param => {
      this.deviceId = param.id;
    });

    this.sub$ = this.logicDeviceTypesService
      .get(this.deviceId)
      .subscribe((x: IDeviceType) => {
        this.deviceType = x;
        this.deviceTypeName = `${this.deviceType.Name}, ${this.deviceType.Code}`;
      });

    this.permissionCheckUtils
      .getAccess([
        'CFG_DEVICE_EDIT_COMMANDS'
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
      promise = this.logicDeviceTypesService.delete(this.deviceId as number);
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl('/references/types-logic-devices');
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
