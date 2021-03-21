import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigateItem } from '../../../../../../common/models/Navigate/NavigateItem';

import { IDeviceType } from '../../../../../../services/data-query';
import { Subscription } from 'rxjs';
import { GlobalValues } from 'src/app/core';
import {
  ContextButtonItem,
  ContextButtonItemConfirm
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { ConfigCommandDeviceTypesService } from 'src/app/services/commands/Configuration/DeviceLogicTypesCommandService.service';

@Component({
  selector: 'rom-commands-tld-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less']
})
export class CommandsTypeLogicDevicesCardComponent implements OnInit, OnDestroy {
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
      code: 'parameters',
      url: 'parameters',
      name: AppLocalization.Options
    }
  ];
  paramSub$: Subscription;

  public get isNew() {
    return this.deviceId === 'new';
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private devLogicTypesTypeService: ConfigCommandDeviceTypesService
  ) {}

  ngOnInit() {
    this.paramSub$ = this.activateRoute.parent.params.subscribe(param => {
      this.deviceId = param.id;
    });

    this.sub$ = this.devLogicTypesTypeService
      .get(this.deviceId)
      .subscribe((x: IDeviceType) => {
        this.deviceType = x;
        this.deviceTypeName = `${this.deviceType.Name}, ${this.deviceType.Code}`;
      });

    this.contextButtonItems = [
      {
        code: 'delete',
        name: AppLocalization.Delete,
        confirm: new ContextButtonItemConfirm(
          AppLocalization.DeleteConfirm,
          AppLocalization.Delete
        )
      }
    ];
  }

  ngOnDestroy() {
    this.unsubscriber(this.sub$);
    this.unsubscriber(this.paramSub$);
  }

  contextButtonHeaderClick(code: string) {
    this.loadingPanel = true;
    let promise: Promise<any> = null;
    let callback: any;
    if (code === 'delete') {
      promise = this.devLogicTypesTypeService.delete(this.deviceId as number);
      callback = (result: any) => {
        if (!result) {
          GlobalValues.Instance.Page.backwardButton.navigate();
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

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }
}
