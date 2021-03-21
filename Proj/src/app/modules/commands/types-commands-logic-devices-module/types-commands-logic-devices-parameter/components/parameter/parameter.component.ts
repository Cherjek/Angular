import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ContextButtonItem,
  ContextButtonItemConfirm
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { ActivatedRoute } from '@angular/router';
import { GlobalValues, PermissionCheckUtils } from 'src/app/core';
import { LogicDeviceTypeCommandParameterService } from 'src/app/services/commands/Configuration/logic-device-type-command-parameter.service';
import { Subscription, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ConfigCommandDeviceTypesService } from 'src/app/services/commands/Configuration/DeviceLogicTypesCommandService.service';

@Component({
  selector: 'rom-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.less']
})
export class TypeLogicDevicesParameterComponent implements OnInit, OnDestroy {
  parameterPath: string;
  parameterId: string | number;
  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  public get isNew() {
    return this.parameterId === 'new';
  }
  public contextButtonItems: ContextButtonItem[];
  public menuItems: NavigateItem[] = [
    {
      code: 'property',
      url: 'property',
      name: AppLocalization.Properties
    },
    {
      code: 'options',
      url: 'options',
      name: AppLocalization.OptionsOfChoice
    }
  ];
  subscription: Subscription;

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private activatedRoute: ActivatedRoute,
    private devLogicTypesTypeService: ConfigCommandDeviceTypesService,
    private deviceTypeCommandParameterService: LogicDeviceTypeCommandParameterService
  ) {
    this.subscription = this.activatedRoute.parent.params
      .pipe(
        map(param => {
          deviceTypeCommandParameterService.idDeviceTypeCommand =
            param.deviceId;
          this.parameterId = deviceTypeCommandParameterService.idParameter =
            param.id;
          return param.deviceId;
        }),
        mergeMap(id =>
          forkJoin({
            parameter: this.deviceTypeCommandParameterService.getParameter(),
            device: this.devLogicTypesTypeService.get(id)
          })
        )
      )
      .subscribe((result: any) => {
        this.parameterPath =
          ((result.device || {}).Name || '') +
          ' , ' +
          ((result.device || {}).Code || '') +
          ' , ' +
          ((result.parameter || {}).Name || '');
      });
  }

  ngOnInit() {
    this.permissionCheckUtils
      .getAccess(
        ['REF_LOGIC_DEVICE_EDIT_COMMANDS'],
        [
          {
            code: 'delete',
            name: AppLocalization.Delete,
            confirm: new ContextButtonItemConfirm(
              AppLocalization.DeleteConfirm,
              AppLocalization.Delete
            )
          }
        ]
      )
      .subscribe(result => (this.contextButtonItems = result));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  contextButtonHeaderClick(code: string) {
    this.loadingPanel = true;
    let promise: Promise<any> = null;
    let callback: any;
    if (code === 'delete') {
      promise = this.deviceTypeCommandParameterService.deleteParameter(
        this.parameterId as number
      );
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
}
