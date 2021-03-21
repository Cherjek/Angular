import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { finalize } from "rxjs/operators";

import { ContextButtonItem, ContextButtonItemConfirm } from '../../../controls/ContextButton/ContextButtonItem';
import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';

import { ObjectCardService } from "../../../services/objecteditors.module/object.editor/ObjectCard.service";
import { ObjectEditorService } from "../../../services/objecteditors.module/object.editor/ObjectEditor.service";
import { EquipmentService } from "../../../services/common/Equipment.service";
import { OELogicDevicesService } from "../../../services/objecteditors.module/object.editor/oe.logicdevices/OELogicDevices.service";

import { GlobalValues, PermissionCheck, AccessDirectiveConfig } from "../../../core";

@Component({
    selector: 'object-editor',
    templateUrl: './object.editor.html',
    styleUrls: ['./object.editor.css'],
    providers: [ObjectCardService, ObjectEditorService]
})
export class ObjectEditorComponent implements OnInit, OnDestroy {
    private subscription: Subscription;

    public menuItems: NavigateItem[];

    public loadingPanel: boolean;
    public headerErrors: any[] = [];
    public contextButtonItems: ContextButtonItem[];
    public objectId: any;
    public header: any;
    public noObjectError: any = false;
    objectCard$: Subscription;
    logicDevices$: Subscription;

    constructor(public activatedRoute: ActivatedRoute,
                public router: Router,
                public objectCardService: ObjectCardService,
                public objectEditorService: ObjectEditorService,

                public equipmentService: EquipmentService,
                public logicDevices: OELogicDevicesService,
                public permissionCheck: PermissionCheck) {

        this.subscription = this.activatedRoute.params.subscribe((params: any) => {
            this.objectId = params['id'];

            if (this.objectId !== 'new') {
                this.initHeaderTitle(this.objectId);

                this.accessContextMenuInit();
                this.accessTabMenu();
            }
            
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.unsubscriber([this.subscription, this.objectCard$, this.logicDevices$]);
    }

    unsubscriber(subs: Subscription[]) {
        subs.forEach(sub => {
            if (sub) { sub.unsubscribe(); }
        });
    }

    private accessTabMenu() {

        this.menuItems = [
            {
                code: "logic-devices",
                url: "logic-devices",
                name: AppLocalization.Label32,
                access: Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'OC_VIEW_OBJECT_EQUIPMENTS' })
            },
            {
                code: "devices",
                url: "devices",
                name: AppLocalization.Label110,
                access: Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'OC_VIEW_OBJECT_DEVICES' })
            },
            {
                code: "properties",
                url: "properties",
                name: AppLocalization.Properties,
                access: Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'OC_VIEW_OBJECT_PROPERTIES' })
            },
            {
                code: "current-data",
                url: "current-data",
                name: AppLocalization.Readings,
                access: Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'OC_VIEW_OBJECT_DATA' })
            },
            {
              code: "files",
              url: "files",
              name: AppLocalization.Files,
              access: Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'OC_VIEW_OBJECT_ATTACHMENTS' })
            }
        ];
        /*const checkAccess = [
            Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'OC_VIEW_OBJECT_EQUIPMENTS' }),
            Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'OC_VIEW_OBJECT_DEVICES' }),
            Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'OC_VIEW_OBJECT_PROPERTIES' }),
            Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'OC_VIEW_OBJECT_DATA' })
        ];

        let menuItems: NavigateItem[] = [];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[] | AccessDirectiveConfig) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        forkJoin(obsrvs)
            .pipe(
                finalize(() => {
                    if (menuItems.length) {
                        menuItems[0].isActive = true;
                    }

                    this.menuItems = menuItems;
                })
            )
            .subscribe((response: any[]) => {
                if (response[0]) {
                    menuItems = [{
                        code: "logic-devices",
                        url: "logic-devices",
                        name: "AppLocalization.Label32",
                        isDisabled: false
                    }];
                }
                if (response[1]) {
                    menuItems = [...menuItems, {
                        code: "devices",
                        url: "devices",
                        name: "AppLocalization.Label110",
                        isDisabled: false
                    }];
                }
                if (response[2]) {
                    menuItems = [...menuItems, {
                        code: "properties",
                        url: "properties",
                        name: AppLocalization.Properties,
                        isDisabled: false
                    }];
                }
                if (response[3]) {
                    menuItems = [...menuItems, {
                        code: "current-data",
                        url: "current-data",
                        name: AppLocalization.Readings,
                        isDisabled: false
                    }];
                }
            });*/

    }
    private accessContextMenuInit() {

        const checkAccess = [
            'DA_ALLOW',
            'DR_ALLOW',
            'DP_ALLOW',

            //настройки для объекта
            Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'DA_START' }),
            Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'DR_START' }),
            Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'OE_DELETE_OBJECT' }),
            Object.assign(new AccessDirectiveConfig(), { keySource: this.objectId, source: 'Units', value: 'OE_CREATE_OBJECT' })
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
                        code: "validation",
                        name: AppLocalization.StartAnalysis,
                        isDisabled: false
                    }];
                }
                if (response[1] && response[4]) {
                    contextButtonItems = [...contextButtonItems, {
                        code: "report",
                        name: AppLocalization.StartReport,
                        isDisabled: false
                    }];
                }
                if (response[2]) {
                    contextButtonItems = [...contextButtonItems, {
                        code: "datapresentation",
                        name: AppLocalization.StartDataPres,
                        isDisabled: false
                    }];
                }
                if (response[5]) {
                    contextButtonItems = [...contextButtonItems, {
                        code: "delete",
                        name: AppLocalization.Delete,
                        isDisabled: false,
                        confirm: new ContextButtonItemConfirm(AppLocalization.DeleteConfirm, AppLocalization.Delete)
                    }];
                }
                if (response[6]) {
                    contextButtonItems = [...contextButtonItems, {
                        code: "clone",
                        name: AppLocalization.Duplicate,
                        isDisabled: false,
                        confirm: new ContextButtonItemConfirm(AppLocalization.DuplicateConfirm, AppLocalization.Duplicate)
                    }];
                }
            });
    }

    public contextButtonHeaderClick(code: string) {

        let notCloneMenuItem: boolean = true;

        this.loadingPanel = true;

        let promise: Promise<any> = null;
        let callback: Function;
        if (code == "delete") {

            promise = this.objectEditorService.delete(`${this.objectId}/delete`);
            callback = (result: any) => {
                if (result === 0) GlobalValues.Instance.Page.backwardButton.navigate();
            }

        } else if (code == "clone") {
            notCloneMenuItem = false;
        } else {
            promise = this.logicDeviceIdsInit();
            let redirect: string;
            if (code == "validation") {
                redirect = 'validation/create';
            } else if (code == "datapresentation") {
                redirect = 'datapresentation/create';
            } else if (code == "report") {
                redirect = 'reports/create';
            }
            callback = (result: any) => {
                let ids = <number[]>result;
                this.run(redirect, ids.join(','));
            }
        }

        if (notCloneMenuItem) {
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
            this.objectEditorService
                .clone(this.objectId)
                .then((cloneUnitId: number) => {
                    this.loadingPanel = false;
                    this.router.navigate([`/object-editor/${cloneUnitId}`]);
                })
                .catch((error: any) => {
                    this.headerErrors.push(error.Message);
                    this.loadingPanel = false;
                });
        }
    }

    private run(redirect: string, idsString: string) {
        this.equipmentService
            .post({
                ids: idsString //'17018,5699,11262',
            })
            .then(guid => {

                let queryParams: any = {};
                queryParams['key'] = guid;

                this.router.navigate(
                    [redirect],
                    {
                        queryParams: queryParams
                    }
                );
            })
            .catch((error: any) => this.headerErrors.push(error.Message));
    }

    private logicDeviceIdsInit(): Promise<number[]> {

        return new Promise((resolve, reject) => {

            this.logicDevices$ = this.logicDevices
                .get(this.objectId)
                .subscribe(
                    (lds) => {
                        let logicDeviceIds = lds.map((ld: any) => {
                            return ld['IdLogicDevice'];
                        });
                        resolve(logicDeviceIds);
                    },
                    (error: any) => {
                        this.headerErrors.push(error.Message);
                        reject(error);
                    }
                );

        });
        
    }

    private initHeaderTitle(objectId: number) {
        this.objectCard$ = this.objectCardService
            .getInfo(objectId)
            .subscribe(
                (data: any) => {
                    this.header = data;
                },
                (error: any) => {
                    this.noObjectError = true;
                });
    }

    get isNew() {
        return this.objectId === 'new';
    }

    public backToPrevPage() {
        GlobalValues.Instance.UrlHistory.backNavigate();
    }
}
