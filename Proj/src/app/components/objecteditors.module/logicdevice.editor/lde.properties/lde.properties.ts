import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from "@angular/router";

import { Subscription } from "rxjs/index";

import { LogicDeviceEditorService } from "../../../../services/objecteditors.module/logicDevice.editor/LogicDeviceEditor.service";
import { DeviceEditorService } from "../../../../services/objecteditors.module/device.editor/DeviceEditor.service";

import { EntityView } from "../../../../services/objecteditors.module/Models/EntityView";
import { DeviceView } from "../../../../services/objecteditors.module/Models/DeviceView";
import { EntityViewProperty } from "../../../../services/common/Models/EntityViewProperty";
import { IPropertyEditorService } from "../../../../services/objecteditors.module/Models/IPropertyEditorService";
import { LogicDeviceEditorPropertiesService } from "../../../../services/objecteditors.module/logicDevice.editor/LogicDeviceEditorProperties";
import { DeviceEditorPropertiesService } from "../../../../services/objecteditors.module/device.editor/DeviceEditorProperties";
import { RelatedDevicesService } from "../../../../services/objecteditors.module/object.editor/oe.logicdevices/RelatedDevices.service";

import { TagView, TagTypeView, DeviceInfoView } from "../../../../services/objecteditors.module/Models/tags.editor/_tagsEditorModels";

import { GlobalValues, PermissionCheck } from "../../../../core";

const keyNewDeviceConnectId = 'LDEPropertiesComponent.storageNewDeviceConnectId';

@Component({
    selector: 'lde-properties',
    templateUrl: './lde.properties.html',
    styleUrls: ['./lde.properties.css'],
    providers: [LogicDeviceEditorPropertiesService, DeviceEditorService, DeviceEditorPropertiesService]
})
export class LDEPropertiesComponent implements OnDestroy {
    private subscription: Subscription;
    private subscriptionQuery: Subscription;

    public entityId: number;
    public unitId: number;

    public properties: EntityViewProperty[];
    public isPropEdit: boolean = false;

    public errorsPropertyPanel: any[] = [];
    public loadingPropertyPanel: boolean = true;

    public errorsDevicesPanel: any[] = [];
    public loadingDevicesPanel: boolean = false;

    public errorsTagsPanel: any[] = [];
    public loadingTagsPanel: boolean;

    private propertyEditorService: IPropertyEditorService;
    deviceEditor$: Subscription;
    propEditor$: Subscription;
    relatedDevices$: Subscription;
    addLogic$: Subscription;

    public get isNew() {
        return this.entityId == null;
    }

    private get connectNewDeviceId() {
        let id = localStorage.getItem(keyNewDeviceConnectId);
        if (id != null) return Number(id);
        return 0;
    }
    private set connectNewDeviceId(id: any) {
        if (id == null) localStorage.removeItem(keyNewDeviceConnectId);
        else localStorage.setItem(keyNewDeviceConnectId, id);
    }
    //подключаемое устройство
    public deviceConnect: DeviceView;
    public get isDeviceConnecting() {
        return this.deviceConnect != null;
    }
    //привязанные устройства к оборудованию
    private devicesRelated: any[] = [];

    private ldType: string;
    public defTagView: TagView;
    private logicDevice: EntityView;

    @ViewChild('tagsEditorComponent', { static: false }) tagsEditorComponent: any;
    @ViewChild('propertiesEditorPanel', { static: true }) propertyEditor: any;
    @ViewChild('propDeviceRelateEditPanel', { static: false }) propDeviceRelateEditor: any;

    constructor(public activatedRoute: ActivatedRoute,
                public logicDeviceEditorService: LogicDeviceEditorService,
                public logicDeviceEditorPropertiesService: LogicDeviceEditorPropertiesService,
                public deviceEditorService: DeviceEditorService,
                public deviceEditorPropertiesService: DeviceEditorPropertiesService,
                public relatedDevicesService: RelatedDevicesService,
                public router: Router,
                public permissionCheck: PermissionCheck) {

        this.propertyEditorService = logicDeviceEditorService;

        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            let id = params['id'];
            if (Number.isInteger(parseInt(id))) {
                this.entityId = Number(id);
            } else {
                this.isPropEdit = true;
            }

            if (this.isNew) {
                this.subscriptionQuery = this.activatedRoute.queryParams.subscribe((qparams: any) => {
                    this.unitId = qparams["unitId"];
                    this.ldType = qparams["ldType"];
                });
            }

            this.init();
        });
    }

    connectDevice() {
        this.router.navigate(['connection-ld-devices'], {
            queryParams: { unitId: this.unitId, ldId: this.entityId }
        });
    }

    createDevice() {
        this.router.navigate(['device-editor/new/device-types'], {
            queryParams: { unitId: this.unitId, returnToLD: true }
        });
    }

    init() {

        //возврат с формы подключения устройства, при подключении
        if (GlobalValues.Instance.Page.connectionLDDevicesComponent != null) {
            this.connectNewDeviceId = GlobalValues.Instance.Page.connectionLDDevicesComponent.deviceId;
            GlobalValues.Instance.Page.connectionLDDevicesComponent = null;
        }

        this.loadProperty();

        //при загрузке показываем список связанных устройств
        //this.loadRelatedDevices();

        //если выбрали подключение устройства
        this.loadDeviceConnect();
    }

    loadProperty() {

        this.loadingPropertyPanel = true;

        let obsr: any;
        let callback: any;
        if (this.entityId == null) {
            obsr = this.propertyEditorService.getNew();
            callback = (properties: EntityViewProperty[]) => {
                this.setTypeProp(properties);
            }
        } else {
            obsr = this.propertyEditorService.getEntity(this.entityId);
            callback = (properties: EntityViewProperty[]) => {
                this.unitId = this.logicDevice.IdUnit;
            }
        }

        this.propEditor$ = obsr.subscribe((data: EntityView) => {
                this.loadingPropertyPanel = false;
                this.logicDevice = data;
                this.properties = data.Properties;
                if (callback) {
                    callback(this.properties);
                }
            },
            (error: any) => {
                this.errorsPropertyPanel = [error];
                this.loadingPropertyPanel = false;
            });
    }

    loadRelatedDevices() {
        if (this.entityId) {
            this.loadingDevicesPanel = true;
            this.relatedDevices$ = this.relatedDevicesService
                .get(this.entityId)
                .subscribe((data: any[]) => {
                        this.loadingDevicesPanel = false;
                        this.devicesRelated = data;
                    },
                    (error: any) => {
                        this.errorsDevicesPanel = [error];
                        this.loadingDevicesPanel = false;
                    });
        }
    }

    loadDeviceConnect() {
        if (this.connectNewDeviceId) {
            this.loadingDevicesPanel = true;
            this.deviceEditor$ = this.deviceEditorService
                .getEntity(this.connectNewDeviceId)
                .subscribe((data: DeviceView) => {
                        this.createDefTagView(data);
                        this.deviceConnect = data;
                        this.loadingDevicesPanel = false;
                    },
                    (error: any) => {
                        this.errorsDevicesPanel = [error];
                        this.loadingDevicesPanel = false;
                    });
        }
    }

    setTypeProp(properties: EntityViewProperty[]) {
        if (this.ldType) {
            let prop: any = properties.find((prop: any) => {
                return prop.Code == "Type";
            });
            prop.Value = JSON.parse(this.ldType);
        }
    }

    ngOnDestroy() {
        this.unsubscriber(
            [this.subscription, this.subscriptionQuery, this.deviceEditor$, this.propEditor$, this.relatedDevices$, this.addLogic$]
            );
        this.connectNewDeviceId = null;
    }

    unsubscriber(subs: Subscription[]) {
        subs.forEach(sub => {
            if (sub) { sub.unsubscribe(); }
        });
    }

    private getDeviceType(properties: EntityViewProperty[]) {
        let property = properties.find(p => p.Code === "DeviceType");
        return parseInt(property.Value.Code);
    }

    createDefTagView(device: DeviceView) {
        this.defTagView = new TagView();
        this.defTagView.TagType = new TagTypeView(0, "");//измерительный канал
        let deviceView = new DeviceInfoView(device.Id, "");
        deviceView.IdDeviceType = this.getDeviceType(device.Properties);
        this.defTagView.Device = deviceView;
    }

    saveObject() {

        let properties: EntityViewProperty[] = this.propertyEditor.getEditProperties();

        this.loadingPropertyPanel = true;

        let entity = {
            Id: this.entityId,
            IdUnit: this.unitId,
            Properties: properties
        }

        let obsr: any;
        let callback: any;
        if (this.entityId == null) {
            obsr = this.propertyEditorService.setNew(<EntityView>entity);
            callback = (idEntity: number) => {
                this.goToEditPage(idEntity);
            }
        } else {
            obsr = this.propertyEditorService.update(<EntityView>entity);
            callback = (idEntity: number) => {
                this.loadProperty();
            }
        }

        obsr.then((idEntity: number) => {
                this.isPropEdit =
                    this.loadingPropertyPanel = false;
                callback(idEntity || this.entityId);
            })
            .catch((error: any) => {
                this.loadingPropertyPanel = false;
                this.errorsPropertyPanel = [error];
            });

    }

    saveDeviceRelate() {

        let properties: EntityViewProperty[] = this.propDeviceRelateEditor.getEditProperties();

        let tags = this.tagsEditorComponent.getTagViewItems();

        if (!(tags || []).length) {
            this.errorsTagsPanel = [AppLocalization.NotChooseTags];
            return;
        }

        let entity = {
            Id: this.entityId,
            IdUnit: this.unitId,
            Device: this.deviceConnect,
            Tags: tags
        }

        entity.Device.Properties = properties;

        this.loadingDevicesPanel = this.loadingTagsPanel = true;

        this.logicDeviceEditorService.saveDeviceRelate(entity)
            .then((idEntity: number) => {
                this.loadingDevicesPanel = this.loadingTagsPanel = false;

                this.cancelDeviceConnect();
            })
            .catch((error: any) => {
                this.loadingDevicesPanel = this.loadingTagsPanel = false;
                this.errorsPropertyPanel = [error];
            });
    }

    goToEditPage(idEntity: number) {

        this.addLogic$ = this.permissionCheck.addLogicDeviceToPermission(idEntity)
            .subscribe(() => {
                this.router.navigate([`../${idEntity}/properties`],
                    {
                        queryParams: { unitId: this.unitId },
                        relativeTo: this.activatedRoute.parent
                    });
            });
        
    }

    back2Objects() {
        GlobalValues.Instance.Page.backwardButton.navigate();
    }

    changeProperties() {
        this.isPropEdit = true;
    }

    cancelDeviceConnect() {
        this.deviceConnect = null;
        this.connectNewDeviceId = null;
    }

    cancelChangeProperty() {
        this.propertyEditor.rollbackProperty();
        this.isPropEdit = false;
    }

    public cancel() {
        if (!this.isNew) {
            this.cancelChangeProperty();
            this.cancelDeviceConnect();
        } else this.back2Objects();
    }
}