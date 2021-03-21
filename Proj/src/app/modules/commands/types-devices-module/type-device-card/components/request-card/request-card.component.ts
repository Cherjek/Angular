import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigateItem } from '../../../../../../common/models/Navigate/NavigateItem';

import {
    DataQuerySettingsService,
    IDeviceType
} from '../../../../../../services/data-query';
import { DeviceTypesService } from 'src/app/services/commands/Configuration/device-types.service';
import {
    ContextButtonItem,
    ContextButtonItemConfirm
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { GlobalValues, PermissionCheckUtils } from 'src/app/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'rom-request-card',
    templateUrl: './request-card.component.html',
    styleUrls: ['./request-card.component.less']
})
export class RequestCardComponent implements OnInit, OnDestroy {
    public loadingPanel: boolean;
    public deviceTypeName: string;
    public deviceType: IDeviceType;
    public headerErrors: any[] = [];
    public contextButtonItems: ContextButtonItem[];
    public deviceId: number | string;
    sub$: Subscription;
    dataSub$: Subscription;
    public menuItems: NavigateItem[] = [
        {
            code: 'property',
            url: 'property',
            name: AppLocalization.Properties
        },
        {
            code: 'data-queue',
            url: 'data-queue',
            name: AppLocalization.Requests,
            access: 'CFG_DEVICE_VIEW_QUERIES'
        },
        {
            code: 'tags',
            url: 'tags',
            name: AppLocalization.Tags,
            access: 'CFG_DEVICE_VIEW_TAGS'
        },
        {
            code: 'commands',
            url: 'commands',
            name: AppLocalization.Commands,
            access: 'CFG_DEVICE_VIEW_COMMANDS'
        },
        {
            code: 'device-type-properties',
            url: 'device-type-properties',
            name: AppLocalization.DeviceTypeProperties,
            access: 'CFG_DEVICE_VIEW_PROPERTIES'
        }
    ];

    public get isNew() {
        return this.deviceId === 'new';
    }

    constructor(
        private activateRoute: ActivatedRoute,
        private deviceTypesService: DeviceTypesService,
        private dataQuerySettingsService: DataQuerySettingsService,
        private permissionCheckUtils: PermissionCheckUtils
    ) { }

    ngOnInit() {
        this.sub$ = this.activateRoute.parent.params.subscribe(params => {
            this.deviceId = params.id;
        });
        if (!this.isNew) {
            this.dataSub$ = this.dataQuerySettingsService
                .getDeviceType(+this.deviceId)
                .subscribe(x => {
                    this.deviceType = x;
                    this.deviceTypeName = `${this.deviceType.Name}, ${this.deviceType.Code}`;
                });
        }
        this.permissionCheckUtils
          .getAccess([
            'CFG_DEVICE_VIEW'
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
        this.unsub(this.sub$);
        this.unsub(this.dataSub$);
    }

    contextButtonHeaderClick(code: string) {
        this.loadingPanel = true;
        let promise: Promise<any> = null;
        let callback: any;
        if (code === 'delete') {
            promise = this.deviceTypesService.delete(this.deviceId as number);
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

    private unsub(sub: Subscription) {
        if (sub) { sub.unsubscribe(); }
    }
}
