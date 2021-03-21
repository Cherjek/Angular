import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ContextButtonItem,
  ContextButtonItemConfirm
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { ActivatedRoute } from '@angular/router';
import { GlobalValues, PermissionCheckUtils } from 'src/app/core';
import { DeviceTypeCommandParameterOptionService } from 'src/app/services/configuration/device-type-command-parameter-option.service';
import { Subscription, forkJoin } from 'rxjs';
import { DeviceTypeCommandsService } from 'src/app/services/configuration/device-type-commands.service';
import { DataQuerySettingsService } from 'src/app/services/data-query';
import { DeviceTypeCommandParameterService } from 'src/app/services/configuration/device-type-command-parameter.service';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'rom-options-card',
  templateUrl: './options-card.component.html',
  styleUrls: ['./options-card.component.less']
})
export class OptionsCardComponent implements OnInit, OnDestroy {
  optionPath: string;
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
    private deviceTypeCommParamOptService: DeviceTypeCommandParameterOptionService,
    private permissionCheckUtils: PermissionCheckUtils,
    private deviceTypeCommandsService: DeviceTypeCommandsService,
    private dataQuerySettingsService: DataQuerySettingsService,
    private deviceTypeCommandParameterService: DeviceTypeCommandParameterService
  ) {
      this.subscription = this.activatedRoute.parent.params
        .pipe(
          map(params => {
            this.optionId = deviceTypeCommParamOptService.idOption = params.id;
            deviceTypeCommandParameterService.idParameter
              = deviceTypeCommParamOptService.idParameter
              = params.idDeviceTypeCommandParameter;
            deviceTypeCommandParameterService.idDeviceTypeCommand
              = deviceTypeCommParamOptService.idDeviceTypeCommand
              = params.idDeviceTypeCommand;
            deviceTypeCommandParameterService.idDeviceType
              = deviceTypeCommParamOptService.idDeviceType
              = deviceTypeCommandsService.idDeviceType 
              = params.idDeviceType;
            return [params.idDeviceType, params.idDeviceTypeCommand];
          }),
          mergeMap(ids =>
            forkJoin({
              settings: this.dataQuerySettingsService.getDeviceType(ids[0]),
              command: this.deviceTypeCommandsService.getCommand(ids[1]),
              parameter: this.deviceTypeCommandParameterService.getParameter(),
              options: this.deviceTypeCommParamOptService.getDeviceTypeCommandParameterOption()
            })
          )
        )
        .subscribe(result => {
          this.optionPath =
            ((result.settings || {} as any).Name || '') +
            ' , ' +
            ((result.settings || {} as any).Code || '') +
            ' , ' +
            (((result.command || {} as any).DeviceCommandType || {} as any).Name || '') +
            ' , ' +
            (result.parameter || {} as any).Name +
            ' , ' +
            (result.options || {} as any).Text;
        });
    }

  ngOnInit() {
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
