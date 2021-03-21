import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild } from '@angular/core';

import { DataGrid, SelectionRowMode as DGSelectionRowMode, ActionButtons as DGActionButton, ActionButtonConfirmSettings as DGActionButtonConfirmSettings } from '../../../../controls/DataGrid';

import { OEDFilterContainerService } from "../../../../services/objecteditors.module/object.editor/oe.devices/Filters/OEDFilterContainer.service";

import { OEDevicesService } from "../../../../services/objecteditors.module/object.editor/oe.devices/OEDevices.services";
import { DeviceEditorService } from "../../../../services/objecteditors.module/device.editor/DeviceEditor.service";

import { Subscription } from "rxjs/index";
import { ActivatedRoute, Router } from "@angular/router";

import { DetailsRowComponent } from "../../../../controls/ListComponentCommon/DetailsRow/DetailsRow";
import { PropertiesPanelComponent } from "../../../../shared/rom-forms/index";
import { DLogicDevicesComponent } from "./d.logicdevices/d.logicdevices";

import { EntityType, PropertiesService } from "../../../../services/common/Properties.service";

import { ExportToXlsx, ExportXlsxOptions } from "../../../../controls/Services/ExportToXlsx";

import { PermissionCheck, AccessDirectiveConfig } from "../../../../core";

@Component({
    selector: 'oe-devices',
    templateUrl: './oe.devices.html',
    styleUrls: ['./oe.devices.css'],
    providers: [DeviceEditorService]
})
export class OEDevicesComponent implements OnInit {

    constructor(public devices: OEDevicesService,
                public filterContainerService: OEDFilterContainerService,
                public activatedRoute: ActivatedRoute,

                public propertiesService: PropertiesService,
                public exportToXlsx: ExportToXlsx,
                public deviceEditorService: DeviceEditorService,

                public router: Router,

                public permissionCheck: PermissionCheck
                ) {
        this.urlParamsSubscribe = this.activatedRoute.parent.params.subscribe(
            params => {
                this.unitId = params['id'];
                this.filterContainerService.setId(params['id']);
            },
            error => {
                this.errors.push(error.Message);
            }
        );
    }

    public unitId: any;
    public urlParamsSubscribe: Subscription;
    public errors: any[] = [];
    public loadingContentPanel: boolean = true;
    private cacheFilter: any;

    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    // DGSelectionRowMode = DGSelectionRowMode;

    DetailsRowComponents: DetailsRowComponent[] = [
        new DetailsRowComponent(AppLocalization.Properties, PropertiesPanelComponent, EntityType.Device), // нужен соотв. сервис
        new DetailsRowComponent(AppLocalization.Label80, DLogicDevicesComponent) // нужен соотв. сервис
    ];

    public ldExportOptions: ExportXlsxOptions;

    public initLDExportOptions() {
        this.ldExportOptions = new ExportXlsxOptions();
        this.ldExportOptions.fileName = AppLocalization.Label78;
        this.ldExportOptions.exportColsInfo = [
            {
                name: "A",
                wpx: 500
            },
            {
                name: "B",
                wpx: 300
            }
        ];
    }

    public onDGRowActionBttnClick(button: any) {

        let rowId = button.item.IdDevice;

        if (button.action === 'PropertiesExport') {

            this.propertiesService.getProperties(rowId, EntityType.Device).subscribe(
                (deviceProps: any[]) => {
                    let deviceProps2Export: any[] = [];
                    deviceProps.forEach((deviceProp: any) => {
                        let devicePropsObj: any = {};
                        devicePropsObj[AppLocalization.Property] = deviceProp['Name'];
                        devicePropsObj[AppLocalization.Value] = deviceProp['Value'];
                        deviceProps2Export.push(devicePropsObj);
                    });

                    this.exportToXlsx.exportAsExcelFile(deviceProps2Export, this.ldExportOptions);
                },
                (error: any) => {
                    this.errors.push(error.Message);
                }
            );

        } if (button.action === 'Delete') {

            this.loadingContentPanel = true;
            this.deviceEditorService.delete(`${rowId}/delete`)
                .then((result: any) => {
                    this.loadingContentPanel = false;
                    this.loadData();
                })
                .catch((error: any) => {
                    this.loadingContentPanel = false;
                    this.errors.push(error.Message);
                });

        }



    }

    public loadData() {
        this.loadingContentPanel = true;

        let filterKey = this.cacheFilter;

        this.devices
            .get(filterKey ? (this.unitId + '/' + filterKey) : this.unitId)
            .subscribe(
                (lds) => {
                    this.initDG(lds);
                    this.loadingContentPanel = false;
                },
                (error) => {
                    this.loadingContentPanel = false;
                    this.errors.push(error.Message);
                }
            );
    }

    ngOnInit() {
        this.loadData();
        this.initLDExportOptions();

        this.DetailsRowComponents[1].params = { unitId: this.unitId };
    }

    initDG(lds: any[]) {
        this.dataGrid.initDataGrid();
        this.dataGrid.KeyField = 'IdDevice';
        //this.dataGrid.Columns = [{
        //    Name: "DeviceTypeDisplayText"
        //}];
        this.dataGrid.ActionButtons = [
            new DGActionButton("PropertiesExport", AppLocalization.ExportProps)
        ];
        this.accessDataGridInit();

        this.dataGrid.DataSource = lds;
    }

    public onApplyFilter(guid: string): void {
        this.cacheFilter = guid;
        this.loadData();
    }

    addDevice() {
        this.router.navigate(['device-editor/new/device-types'],
            {
                queryParams: { unitId: this.unitId }
            });
    }

    private accessDataGridInit() {
        this.permissionCheck.checkAuthorization(Object.assign(new AccessDirectiveConfig(), { keySource: this.unitId, source: 'Units', value: 'OE_DELETE_DEVICE' }))
            .subscribe(authorized => {

                if (authorized) {

                    this.dataGrid.ActionButtons = [...this.dataGrid.ActionButtons,
                        new DGActionButton("Delete", AppLocalization.Delete, new DGActionButtonConfirmSettings(AppLocalization.DeleteConfirm, AppLocalization.Delete))
                    ];

                }

            });
    }
}