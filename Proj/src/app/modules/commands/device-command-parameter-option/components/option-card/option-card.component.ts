import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IDeviceCommandParameterOption } from 'src/app/services/configuration/Models/DeviceCommandParameterOption';
import { Subscription } from 'rxjs';
import { ContextButtonItem, ContextButtonItemConfirm } from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { ActivatedRoute } from '@angular/router';
import { DeviceCommandParameterOptionsService } from 'src/app/services/configuration/device-command-parameter-options.service';
import { GlobalValues, PermissionCheckUtils } from 'src/app/core';

@Component({
    selector: 'rom-option-card',
    templateUrl: './option-card.component.html',
    styleUrls: ['./option-card.component.less']
})
export class OptionCardComponent implements OnInit, OnDestroy {

    option: IDeviceCommandParameterOption;
    optionId: string | number;
    idDeviceCommandParameter: number;
    subscription: Subscription;
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
            name: AppLocalization.Properties,
            // access: 'HH_TYPE_PROPERTY_VIEW'
        }
    ];

    constructor(
        private permissionCheckUtils: PermissionCheckUtils,
        private activatedRoute: ActivatedRoute,
        private deviceCommandParameterOptionsService: DeviceCommandParameterOptionsService) { 
            this.subscription = this.activatedRoute.parent.params.subscribe(params => {
                this.optionId = params.id;
                this.idDeviceCommandParameter = params.idDeviceCommandParameter;

                deviceCommandParameterOptionsService.idDeviceCommandParameter = params.idDeviceCommandParameter;
            });
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
            promise = this.deviceCommandParameterOptionsService.deleteOption(this.optionId as number);
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
