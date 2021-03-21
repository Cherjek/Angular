import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContextButtonItem, ContextButtonItemConfirm } from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { Subscription } from 'rxjs';
import { ILogicDeviceCommand } from 'src/app/services/configuration/Models/LogicDeviceCommand';
import { LogicDeviceCommandsService } from 'src/app/services/configuration/logic-device-commands.service';
import { map, mergeMap } from 'rxjs/operators';
import { GlobalValues, PermissionCheckUtils } from 'src/app/core';


@Component({
    selector: 'rom-ld-command-card',
    templateUrl: './ld-command-card.component.html',
    styleUrls: ['./ld-command-card.component.less'],
    providers: [LogicDeviceCommandsService]
})
export class LogicDeviceCommandComponent implements OnInit, OnDestroy {

    command: ILogicDeviceCommand;
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
            access: 'OE_VIEW_COMMAND'
        },
        {
            code: 'commands',
            url: 'devices-commands',
            name: AppLocalization.TeamsToDevices,
            access: 'OE_VIEW_DEVICE_COMMANDS'
        }
    ];

    constructor(
        private activatedRoute: ActivatedRoute,
        private logicDeviceCommandsService: LogicDeviceCommandsService,
        private permissionCheckUtils: PermissionCheckUtils) { 
        this.subscription = this.activatedRoute.parent.params.pipe(map(params => {
            {
                this.commandId = params.id;
                this.idLogicDevice = params.idLogicDevice;
                logicDeviceCommandsService.idLogicDevice = params.idLogicDevice;
                return params.id;
            }
        }),
        mergeMap(id => logicDeviceCommandsService.getLogicDeviceCommand(id))
        ).subscribe((command: ILogicDeviceCommand) => this.command = command);
    }

    ngOnInit() {
        this.permissionCheckUtils
          .getAccess([
            'OE_DELETE_COMMAND'
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
            promise = this.logicDeviceCommandsService.deleteLogicDeviceCommand(this.commandId as number);
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
