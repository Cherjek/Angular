import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceTypeCommandParameter } from 'src/app/services/configuration/Models/DeviceTypeCommandParameter';
import { ContextButtonItem, ContextButtonItemConfirm } from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { ActivatedRoute } from '@angular/router';
import { GlobalValues, PermissionCheckUtils } from 'src/app/core';
import { DeviceTypeCommandParameterService } from 'src/app/services/configuration/device-type-command-parameter.service';
import { Subscription, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DataQuerySettingsService } from 'src/app/services/data-query';
import { DeviceTypeCommandsService } from 'src/app/services/configuration/device-type-commands.service';

@Component({
    selector: 'rom-parameter',
    templateUrl: './parameter.component.html',
    styleUrls: ['./parameter.component.less']
})
export class ParameterComponent implements OnInit, OnDestroy {

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
            name: AppLocalization.Properties,
            // access: 'HH_TYPE_PROPERTY_VIEW'
        },
        {
            code: 'options',
            url: 'options',
            name: AppLocalization.OptionsOfChoice,
            // access: 'HH_TYPE_PROPERTY_VIEW'
        }
    ];
    subscription: Subscription;

    constructor(private permissionCheckUtils: PermissionCheckUtils,
                private activatedRoute: ActivatedRoute,
                private deviceTypeCommandsService: DeviceTypeCommandsService,
                private dataQuerySettingsService: DataQuerySettingsService,
                private deviceTypeCommandParameterService: DeviceTypeCommandParameterService) {

        this.subscription = this.activatedRoute.parent.params
          .pipe(
            map(params => {
          this.parameterId = deviceTypeCommandParameterService.idParameter = params.id;
          deviceTypeCommandParameterService.idDeviceTypeCommand = params.idDeviceTypeCommand;
          deviceTypeCommandParameterService.idDeviceType = deviceTypeCommandsService.idDeviceType  = params.idDeviceType;
          return [params.idDeviceType, params.idDeviceTypeCommand];
        }),
          mergeMap(ids => forkJoin({
          settings: this.dataQuerySettingsService.getDeviceType(ids[0]),
          command: this.deviceTypeCommandsService.getCommand(ids[1]),
          parameter: deviceTypeCommandParameterService.getParameter()
        }))
        ).subscribe(result => {
          this.parameterPath = ((result.settings || {} as any).Name || '') + ' , '
            + ((result.settings || {} as any).Code || '') + ' , '
            + (((result.command || {} as any).DeviceCommandType || {} as any).Name || '') + ' , '
            + (result.parameter || {} as any).Name;
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
          promise = this.deviceTypeCommandParameterService
          .deleteParameter(this.parameterId as number);
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
