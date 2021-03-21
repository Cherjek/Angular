import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { EquipmentService } from '../../../services/common/Equipment.service';

import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';
import { ContextButtonItem, ContextButtonItemConfirm } from '../../../controls/ContextButton/ContextButtonItem';

import { LogicDeviceCardService } from '../../../services/objecteditors.module/logicDevice.editor/LogicDeviceCard.service';
import { LogicDeviceEditorService } from '../../../services/objecteditors.module/logicDevice.editor/LogicDeviceEditor.service';

import { GlobalValues, PermissionCheck, AccessDirectiveConfig } from '../../../core';


@Component({
    selector: 'ld-editor',
    templateUrl: './logicdevice.editor.html',
    styleUrls: ['./logicdevice.editor.css'],
    providers: [LogicDeviceCardService, LogicDeviceEditorService]
})
export class LogicDeviceEditorComponent implements OnInit, OnDestroy {

    public header: any;

    private subscription: Subscription;
    private subscriptionQuery: Subscription;
    public menuItems: NavigateItem[];

    public loadingPanel: boolean;
    public headerErrors: any[] = [];
    public contextButtonItems: ContextButtonItem[];

    public ldId: any;
    public noLDError = false;
    logicDeviceCard$: Subscription;

    constructor(
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public equipmentService: EquipmentService,
        public logicDeviceCardService: LogicDeviceCardService,
        public logicDeviceEditorService: LogicDeviceEditorService,
        public permissionCheck: PermissionCheck) {

        this.subscription = this.activatedRoute.params.subscribe((params: any) => {
            this.ldId = params.id;

            if (this.ldId !== 'new') {
                this.initHeaderTitle(this.ldId);

                this.accessContextMenuInit();
                this.accessTabMenu();
            }
        });

    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.unsubscriber([this.subscription, this.subscriptionQuery, this.logicDeviceCard$]);
    }

    unsubscriber(subs: Subscription[]) {
        subs.forEach(sub => {
            if (sub) { sub.unsubscribe(); }
        });
    }

    private accessTabMenu() {

        this.menuItems = [{
            code: 'properties',
            url: 'properties',
            name: AppLocalization.Properties,
            access: Object.assign(new AccessDirectiveConfig(), 
              { keySource: this.ldId, source: 'LogicDevices', value: 'OC_VIEW_EQUIPMENT_PROPERTIES' })
        }, {
            code: 'tags',
            url: 'tags',
            name: AppLocalization.Tags,
            access: Object.assign(new AccessDirectiveConfig(), 
              { keySource: this.ldId, source: 'LogicDevices', value: 'OC_VIEW_EQUIPMENT_TAGS' })
        }, {
            code: 'commands',
            url: 'commands',
            name: AppLocalization.ManagementTeams,
            access: 'OE_VIEW_COMMANDS'
        }, {
            code: 'current-data',
            url: 'current-data',
            name: AppLocalization.Readings,
            access: Object.assign(new AccessDirectiveConfig(), 
              { keySource: this.ldId, source: 'LogicDevices', value: 'OC_VIEW_EQUIPMENT_DATA' })
        }, {
            code: 'tariff',
            url: 'tariff',
            name: AppLocalization.Rate,
            access: 'TC_LOGIC_DEVICE_TARIFF_VIEW'
        }, {
          code: "files",
          url: "files",
          name: AppLocalization.Files,
          access: Object.assign(new AccessDirectiveConfig(), 
            { keySource: this.ldId, source: 'LogicDevices', value: 'OC_VIEW_EQUIPMENT_ATTACHMENTS' })
        }];

    }
    private accessContextMenuInit() {

        const checkAccess = [
            'DA_ALLOW__',
            'DR_ALLOW__',
            'DP_ALLOW__',

            // настройки для объекта
            Object.assign(new AccessDirectiveConfig(), { keySource: this.ldId, source: 'LogicDevices', value: 'DA_START__' }),
            Object.assign(new AccessDirectiveConfig(), { keySource: this.ldId, source: 'LogicDevices', value: 'DR_START__' }),
            Object.assign(new AccessDirectiveConfig(), { keySource: this.ldId, source: 'LogicDevices', value: 'OE_DELETE_EQUIPMENT' })
        ];

        let contextButtonItems: ContextButtonItem[] = [];

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
                if (response[0] && response[3]) {
                    contextButtonItems = [{
                        code: 'validation',
                        name: AppLocalization.StartAnalysis,
                        isDisabled: false
                    }];
                }
                if (response[1] && response[4]) {
                    contextButtonItems = [...contextButtonItems, {
                        code: 'report',
                        name: AppLocalization.StartReport,
                        isDisabled: false
                    }];
                }
                if (response[2]) {
                    contextButtonItems = [...contextButtonItems, {
                        code: 'datapresentation',
                        name: AppLocalization.StartDataPres,
                        isDisabled: false
                    }];
                }
                if (response[5]) {
                    contextButtonItems = [...contextButtonItems, {
                        code: 'delete',
                        name: AppLocalization.Delete,
                        isDisabled: false,
                        confirm: new ContextButtonItemConfirm(AppLocalization.DeleteConfirm, AppLocalization.Delete)
                    }];
                }
            });
    }

    public contextButtonHeaderClick(code: string) {

        this.loadingPanel = true;

        let promise: Promise<any> = null;
        let callback: Function;
        if (code == 'delete') {

            promise = this.logicDeviceEditorService.delete(`${this.ldId}/delete`);
            callback = (result: any) => {
                if (result === 0) { GlobalValues.Instance.Page.backwardButton.navigate(); }
            };

            promise
                .then((result: any) => {
                    this.loadingPanel = false;
                    callback(result);
                })
                .catch((error: any) => {
                    this.loadingPanel = false;
                    this.headerErrors.push(error.Message);
                });

        } else {
            if (code == 'validation') {
                this.run('validation/create');
            } else if (code == 'datapresentation') {
                this.run('datapresentation/create');
            } else if (code == 'report') {
                this.run('reports/create');
            }
        }
    }

    private run(redirect: string) {
        this.equipmentService
            .post({
                ids: this.ldId // '17018,5699,11262',
            })
            .then(guid => {

                const queryParams: any = {};
                queryParams.key = guid;

                this.router.navigate(
                    [redirect],
                    {
                        queryParams
                    }
                );
            })
            .catch((error: any) => this.headerErrors.push(error.Message));
    }

    private initHeaderTitle(logicDeviceId: number) {
        this.logicDeviceCard$ = this.logicDeviceCardService
            .getInfo(logicDeviceId)
            .subscribe(
                (data: any) => {
                    this.header = data;
                },
                (error: any) => {
                    this.noLDError = true;
                });
    }

    get isNew() {
        return this.ldId === 'new';
    }

    public backToPrevPage() {
        GlobalValues.Instance.UrlHistory.backNavigate();
    }
}
