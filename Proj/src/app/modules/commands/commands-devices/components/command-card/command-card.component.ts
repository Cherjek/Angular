import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DevicesCommandsService } from 'src/app/services/configuration/devices-commands.service';
import { Subscription, forkJoin } from 'rxjs';
import { ContextButtonItem, ContextButtonItemConfirm } from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { ActivatedRoute } from '@angular/router';
import { GlobalValues, PermissionCheckUtils } from 'src/app/core';
import { map, mergeMap } from 'rxjs/operators';
import { LogicDeviceCommandsService } from 'src/app/services/configuration/logic-device-commands.service';

@Component({
  selector: 'rom-command-card',
  templateUrl: './command-card.component.html',
  styleUrls: ['./command-card.component.less'],
  providers: [DevicesCommandsService]
})
export class CommandCardComponent implements OnInit, OnDestroy {

    commandPath: string;
    commandId: string | number;
    idLogicDevice: number;
    subscription: Subscription;
    public loadingPanel: boolean;
    public headerErrors: any[] = [];
    public get isNew() {
        return this.commandId === 'new';
    }
    public contextButtonItems: ContextButtonItem[];
    public menuItems: NavigateItem[] = [
        {
            code: 'property',
            url: 'property',
            name: AppLocalization.Properties,
            access: 'OE_VIEW_DEVICE_COMMAND'
        },
        {
            code: 'params',
            url: 'params',
            name: AppLocalization.Options,
            // access: 'HH_TYPE_PROPERTY_VIEW'
        }
    ];

    constructor(
        private activatedRoute: ActivatedRoute,
        private logicDeviceCommandsService: LogicDeviceCommandsService,
        private devicesCommandsService: DevicesCommandsService,
        private permissionCheckUtils: PermissionCheckUtils) {
        this.subscription = this.activatedRoute.parent.params.pipe(map(params => {
                this.commandId = params.id;
                this.idLogicDevice  = params.idLogicDevice;
                this.logicDeviceCommandsService.idLogicDevice = devicesCommandsService.idLogicDeviceCommand = params.idLogicDeviceCommand;
                return [params.idLogicDeviceCommand, params.id];
        }),
        mergeMap(ids => forkJoin({
            logicDevice: logicDeviceCommandsService.getLogicDeviceCommand(ids[0]),
            logicDeviceCommand: devicesCommandsService.getDeviceCommand(ids[1])
        }))
        ).subscribe((result: any) => {
            this.commandPath
                = ((result.logicDevice.CommandType || {}).Name || '') + ' , ' + ((result.logicDeviceCommand.Device || {}).Name || '');
        });
    }

    ngOnInit() {
        this.permissionCheckUtils
          .getAccess([
            'OE_DELETE_DEVICE_COMMAND'
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
            promise = this.devicesCommandsService.deleteDeviceCommand(this.commandId as number);
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
