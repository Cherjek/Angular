import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/index";

import { DeviceEditorService } from "../../../../services/objecteditors.module/device.editor/DeviceEditor.service";
import { DeviceView, ParentDeviceView } from "../../../../services/objecteditors.module/Models/DeviceView";
import { EntityViewProperty } from "../../../../services/common/Models/EntityViewProperty";
import { IPropertyEditorService } from "../../../../services/objecteditors.module/Models/IPropertyEditorService";
import { DeviceEditorPropertiesService } from "../../../../services/objecteditors.module/device.editor/DeviceEditorProperties";

import { GlobalValues } from '../../../../core';
import { PropertiesEditorPanelComponent } from 'src/app/shared/rom-forms';

const keyNewDeviceConnectId = 'DEPropertiesComponent.storageNewDeviceConnectId';

@Component({
    selector: 'de-properties',
    templateUrl: './de.properties.html',
    styleUrls: ['./de.properties.css'],
    providers: [DeviceEditorPropertiesService]
})
export class DEPropertiesComponent implements OnDestroy {
    private subscription: Subscription;
    private subscriptionQuery: Subscription;

    private entityId: number;
    unitId: number;
    deviceView: DeviceView;

    public properties: EntityViewProperty[];
    public isPropEdit: boolean = false;
    @ViewChild('propertiesEditorPanel', {static: false}) propertiesEditorPanel: PropertiesEditorPanelComponent;

    public errorsPropertyPanel: any[] = [];
    public loadingPropertyPanel: boolean;

    private propertyEditorService: IPropertyEditorService;
    data$: Subscription;

    public get isNew() {
        return this.entityId == null;
    }

    private get connectNewDevice() {
        let device = localStorage.getItem(keyNewDeviceConnectId);
        if (device != null) return JSON.parse(device);
        return undefined;
    }
    private set connectNewDevice(device: any) {
        if (device == null) localStorage.removeItem(keyNewDeviceConnectId);
        else localStorage.setItem(keyNewDeviceConnectId, JSON.stringify(device));
    }
    private oldParentDevice: ParentDeviceView;

    //���� ��� ���������� ��������������, �� ��������� � ������ ����������� ���������, � connection-ld-devices
    //�� ������� connectNewDevice, ���� ����� �� ���� ����� - connection-ld-devices, �� ���� ��������� � �� ��������� �� ������ �����
    private isNotClearIfDeviceEdit: boolean;

    returnToLD: boolean;//������� �������� � ����� �������� ������������, ���������� ������ ����������

    deviceName: string;

    constructor(public activatedRoute: ActivatedRoute,
                public deviceEditorService: DeviceEditorService,
                public deviceEditorPropertiesService: DeviceEditorPropertiesService,
                public router: Router) {

        this.propertyEditorService = deviceEditorService;

        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            if (params['id'] !== 'new') {
                this.entityId = params['id'];
            } else {
                this.isPropEdit = true;
            }

            this.subscriptionQuery = this.activatedRoute.queryParams.subscribe((qparams: any) => {
                this.deviceName = qparams["deviceName"];
                this.unitId = qparams["unitId"];
                this.returnToLD = qparams['returnToLD'];
            });

            this.init();
        });
    }

    init() {

        //���� ������� � ����� ����������� ����������, ��� ����������� ������������� ����������
        if (GlobalValues.Instance.Page.connectionLDDevicesComponent != null) {
            this.connectNewDevice = GlobalValues.Instance.Page.connectionLDDevicesComponent;
            GlobalValues.Instance.Page.connectionLDDevicesComponent = null;
        }

        this.loadProperty();
    }

    loadProperty() {
        this.loadingPropertyPanel = true;
        let obsr: any;
        let callback: any;
        if (this.entityId == null) {
            let device = JSON.parse(this.deviceName);
            obsr = this.propertyEditorService.getNew(device['Code']);
            callback = (properties: EntityViewProperty[]) => {
                this.setTypeProp(properties);
            }
        } else
            obsr = this.propertyEditorService.getEntity(this.entityId);

        this.data$ = obsr.subscribe((data: DeviceView) => {
                this.loadingPropertyPanel = false;

                this.deviceView = data;
                this.oldParentDevice = this.deviceView.ParentDevice;

                if (this.connectNewDevice != null) {
                    this.deviceView.ParentDevice = new ParentDeviceView(this.connectNewDevice.deviceId, this.connectNewDevice.name, null);
                    this.isPropEdit = true;
                }

                this.properties = this.deviceView.Properties;

                if (callback) callback(this.properties);
            },
            (error: any) => {
                this.errorsPropertyPanel = [error];
                this.loadingPropertyPanel = false;
            });
    }

    setTypeProp(properties: EntityViewProperty[]) {
        let prop: any = this.properties.find((prop: any) => {
            return prop.Code == "DeviceType";
        });

        prop.Value = JSON.parse(this.deviceName);
    }

    ngOnDestroy() {
        this.unsubscriber([this.subscription, this.subscriptionQuery, this.data$]);

        if (!this.isNotClearIfDeviceEdit) this.connectNewDevice = null;
    }

    unsubscriber(subs: Subscription[]) {
        subs.forEach(sub => {
            if (sub) { sub.unsubscribe(); }
        });
    }

    saveObject(properties: EntityViewProperty[]) {
        if(!properties) {
            properties = this.propertiesEditorPanel.getEditProperties()
        }
        this.loadingPropertyPanel = true;

        let entity = {
            Id: this.entityId,
            IdUnit: this.unitId,
            ParentDevice: this.deviceView.ParentDevice,
            Properties: properties
        };
        
        let obsr: any;
        let callback: any;
        if (this.entityId == null) {
            obsr = this.propertyEditorService.setNew(<DeviceView>entity);
            callback = (idEntity: number) => {
                this.goToEditPage(idEntity);
            }
        } else {
            obsr = this.propertyEditorService.update(<DeviceView>entity);
            callback = (idEntity: number) => {
                this.loadProperty();
            }
        }

        obsr.then((idEntity: number) => {
            this.isPropEdit = this.loadingPropertyPanel = false;
            this.connectNewDevice = null;
            callback(idEntity || this.entityId);
        })
            .catch((error: any) => {
                this.loadingPropertyPanel = false;
                this.errorsPropertyPanel = [error];
            });
    }

    goToEditPage(idEntity: number) {

        if (this.returnToLD == null) {
            this.router.navigate([`/device-editor/${idEntity}/properties`],
                {
                    queryParams: { unitId: this.unitId }
                });
        } else {
            GlobalValues.Instance.Page = {
                connectionLDDevicesComponent: {
                    deviceId: idEntity
                }
            };
            GlobalValues.Instance.Page.backwardButton.navigate();
        }
    }

    changeProperties() {
        this.isPropEdit = true;
    }
    
    back2Devices() {
        GlobalValues.Instance.Page.backwardButton.navigate();
    }

    navigateParentDevice() {
        this.router.navigate([`/device-editor/${this.deviceView.ParentDevice.Id}/properties`], {
            queryParams: { unitId: this.unitId }
        });
    }

    connectDevice() {
        this.isNotClearIfDeviceEdit = this.isPropEdit;

        this.router.navigate(['connection-ld-devices'], {
            queryParams: { unitId: this.unitId, deviceId: this.entityId }
        });
    }

    rollbackPropertyChanges(propertyEditor: any) {
        propertyEditor.rollbackProperty();
        this.isPropEdit = false;
    }

    cancelDeviceConnect() {
        //this.deviceConnect = null;
        this.deviceView.ParentDevice = this.oldParentDevice;
        this.connectNewDevice = null;
    }

    cancel(propertyEditor: any) {
        if(!propertyEditor) {
            propertyEditor = this.propertiesEditorPanel;
        }
        if (!this.isNew) {

            this.rollbackPropertyChanges(propertyEditor);

            this.cancelDeviceConnect();
        }
        else this.back2Devices();
    }
}