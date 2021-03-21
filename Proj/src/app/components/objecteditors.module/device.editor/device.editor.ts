import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, forkJoin } from "rxjs";
import { finalize} from "rxjs/operators";

import { DeviceCardService } from "../../../services/objecteditors.module/device.editor/DeviceCard.service";
import { DeviceEditorService } from "../../../services/objecteditors.module/device.editor/DeviceEditor.service";

import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';
import { ContextButtonItem, ContextButtonItemConfirm } from '../../../controls/ContextButton/ContextButtonItem';

import { GlobalValues } from '../../../core';

import { PermissionCheck, AccessDirectiveConfig } from "../../../core";

@Component({
    selector: 'device-editor',
    templateUrl: './device.editor.html',
    styleUrls: ['./device.editor.css'],
    providers: [DeviceCardService, DeviceEditorService]
})
export class DeviceEditorComponent implements OnInit, OnDestroy {

    subscription: Subscription;
    subscriptionQuery: Subscription;
    deviceId: any;
    header: any;
    unitId: number;

    public loadingPanel: boolean;
    public headerErrors: any[] = [];
    public contextButtonItems: ContextButtonItem[];
    public menuItems: NavigateItem[];

    public noDeviceError: boolean = false;
    deviceCard$: Subscription;

    constructor(public activatedRoute: ActivatedRoute,
                public router: Router,
                public deviceCardService: DeviceCardService,
                public deviceEditorService: DeviceEditorService,
                public permissionCheck: PermissionCheck) {
        this.subscription = this.activatedRoute.params.subscribe((params: any) => {
            this.deviceId = params['id'];

            if (this.deviceId !== 'new') {
                this.initHeaderTitle(this.deviceId);                
            }

            this.subscriptionQuery = this.activatedRoute.queryParams.subscribe((qparams: any) => {
                this.unitId = qparams["unitId"];

                this.accessTabMenu();
                this.accessContextMenuInit();
            });
        });
    }

    ngOnInit() {
        
    }

    get isNew() {
        return this.deviceId === 'new';
    }

    initHeaderTitle(deviceId: number) {
        this.deviceCard$ = this.deviceCardService
            .getInfo(deviceId)
            .subscribe(
                (data: any) => {
                this.header = data;
            },
                (error: any) => {
                this.noDeviceError = true;
            });
    }

    ngOnDestroy() {
        this.unsubscriber([this.subscription, this.subscriptionQuery, this.deviceCard$]);
    }

    unsubscriber(subs: Subscription[]) {
        subs.forEach(sub => {
            if (sub) { sub.unsubscribe(); }
        });
    }

    private accessTabMenu() {

        this.menuItems = [{
            code: "properties",
            url: "properties",
            name: AppLocalization.Properties,
            access: Object.assign(new AccessDirectiveConfig(), { keySource: this.unitId, source: 'Units', value: 'OC_VIEW_DEVICE_PROPERTIES' })
        },
        {
            code: "device-types-request",
            url: "device-types-request",
            name: AppLocalization.Requests,
            access: 'OE_VIEW_QUERY'
        }, {
          code: "files",
          url: "files",
          name: AppLocalization.Files,
          access: Object.assign(new AccessDirectiveConfig(), { keySource: this.unitId, source: 'Units', value: 'OC_VIEW_DEVICE_ATTACHMENTS' })
        }];
    }
    private accessContextMenuInit() {
        const checkAccess = [
            Object.assign(new AccessDirectiveConfig(), { keySource: this.unitId, source: 'Units', value: 'OE_DELETE_DEVICE' })
        ];

        let contextButtonItems: ContextButtonItem[];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[] | AccessDirectiveConfig) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        forkJoin(obsrvs)
            .pipe(
                finalize(() => {
                    this.contextButtonItems = contextButtonItems;
                })
            )
            .subscribe((response: any[]) => {
                if (response[0]) {
                    contextButtonItems = [{
                        code: "delete",
                        name: AppLocalization.Delete,
                        confirm: new ContextButtonItemConfirm(AppLocalization.DeleteConfirm, AppLocalization.Delete)
                    }]
                }
            });
        
    }

    public contextButtonHeaderClick(code: string) {

        this.loadingPanel = true;

        let promise: Promise<any> = null;
        let callback: Function;
        if (code == "delete") {

            promise = this.deviceEditorService.delete(`${this.deviceId}/delete`);
            callback = (result: any) => {
                if (result === 0) GlobalValues.Instance.Page.backwardButton.navigate();
            }

            promise
                .then((result: any) => {
                    this.loadingPanel = false;
                    callback(result);
                })
                .catch((error: any) => {
                    this.loadingPanel = false;
                    this.headerErrors.push(error.Message);
                });

        }
    }

    public backToPrevPage() {
        GlobalValues.Instance.UrlHistory.backNavigate();
    }
}
