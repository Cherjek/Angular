import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ContextButtonItem,
  ContextButtonItemConfirm
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { ActivatedRoute } from '@angular/router';
import { GlobalValues, PermissionCheckUtils } from 'src/app/core';
import { LogicDeviceTypeCommandParameterOptionService } from 'src/app/services/commands/Configuration/logic-device-type-command-parameter-option.service';
import { Subscription, forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { LogicDeviceTypeCommandParameterService } from 'src/app/services/commands/Configuration/logic-device-type-command-parameter.service';
import { ConfigCommandDeviceTypesService } from 'src/app/services/commands/Configuration/DeviceLogicTypesCommandService.service';

@Component({
  selector: 'rom-tldoc-options-card',
  templateUrl: './options-card.component.html',
  styleUrls: ['./options-card.component.less'],
  providers: [LogicDeviceTypeCommandParameterService]
})
export class TypeLogicDevicesOptionsCardComponent implements OnInit, OnDestroy {
  parameter: string;
  optionId: string | number;
  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  public get isNew() {
    return this.optionId === 'new';
  }
  public contextButtonItems: ContextButtonItem[];
  public menuItems: NavigateItem[] = [
    {
      code: 'property',
      url: 'property',
      name: AppLocalization.Properties
    }
  ];
  subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private permissionCheckUtils: PermissionCheckUtils,
    private deviceTypeCommParamOptService: LogicDeviceTypeCommandParameterOptionService,
    private deviceTypeCommandParameterService: LogicDeviceTypeCommandParameterService,
    private devLogicTypesTypeService: ConfigCommandDeviceTypesService
  ) {
    this.subscription = this.activatedRoute.parent.params
      .pipe(
        map(param => {
          deviceTypeCommParamOptService.idDeviceType = deviceTypeCommandParameterService.idDeviceTypeCommand =
            param.deviceId;
          this.deviceTypeCommParamOptService.idParameter = deviceTypeCommandParameterService.idParameter =
            param.parameterId;
          this.optionId = deviceTypeCommParamOptService.idOption = param.id;
          return param.deviceId;
        }),
        mergeMap(
          id =>
            forkJoin({
              option: this.deviceTypeCommParamOptService.getDeviceTypeCommandParameterOption() as any,
              param: this.deviceTypeCommandParameterService.getParameter() as any,
              device: this.devLogicTypesTypeService.get(id)
            }) as any
        )
      )
      .subscribe((result: any) => {
        this.parameter =
          ((result.device || {}).Name || '') +
          ' , ' +
          ((result.device || {}).Code || '') +
          ' , ' +
          (result.param.Name || '') +
          ' , ' +
          (result.option.Text || '');
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
      promise = this.deviceTypeCommParamOptService.deleteDeviceTypeCommandParameterOption(
        this.optionId as number
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
