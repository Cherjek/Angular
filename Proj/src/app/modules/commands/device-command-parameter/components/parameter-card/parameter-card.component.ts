import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ContextButtonItem, ContextButtonItemConfirm } from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { ActivatedRoute } from '@angular/router';
import { DeviceCommandParametersService } from 'src/app/services/configuration/device-command-parameters.service';
import { GlobalValues, PermissionCheckUtils } from 'src/app/core';
import { LogicDeviceCommandsService } from 'src/app/services/configuration/logic-device-commands.service';
import { DevicesCommandsService } from 'src/app/services/configuration/devices-commands.service';
import { map, mergeMap } from 'rxjs/operators';

@Component({
    selector: 'rom-parameter-card',
    templateUrl: './parameter-card.component.html',
    styleUrls: ['./parameter-card.component.less']
})
export class ParameterCardComponent implements OnInit, OnDestroy {

    parameterPath: string;
    parameterId: string | number;
    idDeviceCommand: number;
    subscription: Subscription;
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

    constructor(
        private permissionCheckUtils: PermissionCheckUtils,
        private activatedRoute: ActivatedRoute,
        private deviceCommandParametersService: DeviceCommandParametersService,
        private logicDeviceCommandsService: LogicDeviceCommandsService,
        private devicesCommandsService: DevicesCommandsService,
        private logicDeviceTypeCommandParameterService: DeviceCommandParametersService
        ) {
            this.subscription = this.activatedRoute.parent.params.pipe(map( params => {
                this.parameterId = params.id;
                logicDeviceCommandsService.idLogicDevice = params.idLogicDevice;
                devicesCommandsService.idLogicDeviceCommand = params.idLogicDeviceCommand;
                this.idDeviceCommand
                    = deviceCommandParametersService.idDeviceCommand
                    = logicDeviceTypeCommandParameterService.idDeviceCommand
                    = params.idDeviceCommand;
                return [params.idLogicDeviceCommand, params.idDeviceCommand, this.parameterId];
            }),
            mergeMap(ids => forkJoin(
                {
                    logicDevice: this.logicDeviceCommandsService.getLogicDeviceCommand(ids[0]),
                    logicDeviceCommand: this.devicesCommandsService.getDeviceCommand(ids[1]),
                    logicDeviceCommandType: this.logicDeviceTypeCommandParameterService.getParameter(ids[2])
                }
            ))
            )
            .subscribe(
                (result: any) =>
                (this.parameterPath
                    // tslint:disable-next-line:max-line-length
                    = `${((result.logicDevice.CommandType || {}).Name || '')} , ${((result.logicDeviceCommand.Device || {}).Name || '')} , ${((result.logicDeviceCommandType.DeviceParameter || {} ).Name || '')}`));
        }

    ngOnInit() {
        this.permissionCheckUtils
          .getAccess([
            'OE_EDIT_DEVICE_COMMAND'
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

    public contextButtonHeaderClick(code: string) {
        this.loadingPanel = true;
        let promise: Promise<any> = null;
        let callback: Function;
        if (code === 'delete') {
            promise = this.deviceCommandParametersService.deleteParameter(this.parameterId as number);
            callback = (result: any) => {
                if (result === 0) {
                    GlobalValues.Instance.Page.backwardButton.navigate();
                }
            };
        }
        promise.then(
            (result: any) => {
                this.loadingPanel = false;
                callback(result);
            }).catch(
                (error: any) => {
                    this.loadingPanel = false;
                    this.headerErrors = [error];
                });
    }
}
