import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, ViewChild, AfterViewInit } from '@angular/core';

import * as GridControls from '../../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import DGSelectionRowMode = GridControls.SelectionRowMode;
import DGActionButtom = GridControls.ActionButtons;
import DGActionButtonConfirmSettings = GridControls.ActionButtonConfirmSettings;

import { PropertiesPanelComponent } from "../../../../shared/rom-forms/index";
import { LDDevicesComponent } from "./ld.devices/ld.devices";

import { OELogicDevicesService } from "../../../../services/objecteditors.module/object.editor/oe.logicdevices/OELogicDevices.service";
import { OELDStatusesService } from "../../../../services/objecteditors.module/object.editor/oe.logicdevices/OE.LD.Statuses.services";
import { LDStatusesService } from "../../../../services/objects.module/LogicDevices/LDStatuses.service";

import { EquipmentService } from "../../../../services/common/Equipment.service";
import { OELDFilterContainerService } from "../../../../services/objecteditors.module/object.editor/oe.logicdevices/Filters/OELDFilterContainer.service";

import { Subscription, queueScheduler } from "rxjs";
import { observeOn } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";

import { DetailsRowComponent } from "../../../../controls/ListComponentCommon/DetailsRow/DetailsRow";

import { EntityType, PropertiesService } from "../../../../services/common/Properties.service";

import { ExportToXlsx, ExportXlsxOptions } from "../../../../controls/Services/ExportToXlsx";

import { LogicDeviceEditorService } from "../../../../services/objecteditors.module/logicDevice.editor/LogicDeviceEditor.service";
import { ListView } from "../../../../controls/ListView/ListView";

import { PermissionCheck, AccessDirectiveConfig } from "../../../../core";
import { CurrentUserService } from '../../../../services/authorization.module/current.user.service';

@Component({
    selector: 'oe-logicdevices',
    templateUrl: './oe.logicdevices.html',
    styleUrls: ['./oe.logicdevices.css'],
    providers: [LogicDeviceEditorService]
})
export class OELogicDevicesComponent implements AfterViewInit {

    constructor(private logicDevices: OELogicDevicesService,
                private statusesService: OELDStatusesService,

                private equipmentService: EquipmentService,
                public filterContainerService: OELDFilterContainerService,

                private propertiesService: PropertiesService,
                private exportToXlsx: ExportToXlsx,

                private activatedRoute: ActivatedRoute,
                private router: Router,

                private logicDeviceEditorService: LogicDeviceEditorService,
                
                private permissionCheck: PermissionCheck,
                private currentUserService: CurrentUserService) {

        this.urlParamsSubscribe = this.activatedRoute.parent.params.subscribe(
            params => {
                this.unitId = params['id'];
                this.filterContainerService.setId(this.unitId);
                this.ldsInit();
            },
            error => {
                this.errors.push(error.Message);
            }
        );
    }

    public unitId: any;
    private urlParamsSubscribe: Subscription;
    public errors: any[] = [];
    public loadingContentPanel: boolean;
    private loadingCheckAccessCommand: boolean;
    private cacheFilter: any;
    public isBasketAnalyzeNotAccess: boolean;
    public isBasketReportNotAccess: boolean;
    public isBasketDataNotAccess: boolean;

    BigDataSource: any[];

    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
    @ViewChild('basketLV', { static: true }) public basketLV: ListView;
    public DGSelectionRowMode = DGSelectionRowMode;
    public DetailsRowComponents: DetailsRowComponent[] = [
        new DetailsRowComponent(AppLocalization.Properties, PropertiesPanelComponent, EntityType.LogicDevice),
        new DetailsRowComponent(AppLocalization.LinkedDevices, LDDevicesComponent)
    ];

    private ldExportOptions: ExportXlsxOptions;

    toBasketLV() {
        let selectedRows: any[] = this.dataGrid.getSelectDataRows();
        this.removeRowsFromDG(selectedRows);
        this.addRowsToBasketLV(selectedRows);
    }
    removeRowsFromDG(rows: any[]) {
        rows.forEach((row: any) => {
            this.dataGrid.deleteRow(row['IdLogicDevice']);
        });
    }
    addRowsToBasketLV(rows: any[]) {
        let basketSource: any[] = (this.basketLV.DataSource || []).map((LI: any) => { return LI.Data; });
        basketSource = basketSource.concat(rows);
        this.basketLV.DataSource = basketSource;

        this.accessBasketInit();
    }
    fromBasketLV(rows: any[]) {
        this.removeRowsFromBasketLV(rows);
        this.addRowsToDG(rows);
    }
    removeRowsFromBasketLV(rows: any[]) {
        let basketSource: any[] = this.basketLV.DataSource.map((LI: any) => { return LI.Data; });
        rows.forEach((row: any) => {
            let rowInd: number = basketSource.indexOf(row);
            basketSource.splice(rowInd, 1);
        });
        this.basketLV.DataSource = basketSource;

        this.accessBasketInit();
    }
    addRowsToDG(rows: any[]) {
        let basketSource = this.basketLV.DataSource;
        let dataGridSource: any[] = this.BigDataSource.filter((DGRow: any) => {
            return basketSource.find((basketRow: any) => {
                return basketRow.Data['IdLogicDevice'] == DGRow['IdLogicDevice'];
            }) == undefined;
        });
        this.dataGrid.DataSource = dataGridSource;
    }
    onDGRowActionBttnClick(button: any) {

        let rowId = button.item.IdLogicDevice;

        if (button.action === 'PropertiesExport') {

            this.propertiesService.getProperties(rowId, EntityType.LogicDevice).subscribe(
                (ldProps: any[]) => {
                    let ldProps2Export: any[] = [];
                    ldProps.forEach((ldProp: any) => {
                        let ldPropsObj: any = {};
                        ldPropsObj[AppLocalization.Property] = ldProp['Name'];
                        ldPropsObj[AppLocalization.Value] = ldProp['Value'];
                        ldProps2Export.push(ldPropsObj);
                    });

                    this.exportToXlsx.exportAsExcelFile(ldProps2Export, this.ldExportOptions);
                },
                (error: any) => {
                    this.errors.push(error.Message);
                }
            );

        } if (button.action === 'Delete') {

            this.loadingContentPanel = true;
            this.logicDeviceEditorService.delete(`${rowId}/delete`)
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

    initLDExportOptions() {
        this.ldExportOptions = new ExportXlsxOptions();
        this.ldExportOptions.fileName = AppLocalization.Label77;
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

    private loadData() {

        let filterKey = this.cacheFilter;

        this.loadingContentPanel = true;

        this.logicDevices
            .get(filterKey ? this.unitId + '/' + filterKey : this.unitId) // TODO - для дублированного объекта этот метод возвращает пустой массив логических устройств
            .subscribe(
                (lds: any[]) => {
                    this.BigDataSource = JSON.parse(JSON.stringify(lds)); // строки при изначальной загрузке или после применения фильтра

                    let dataGridSrc = this.deleteBasketRows(lds); // без тех что в корзине
                    this.initDG(dataGridSrc);

                    this.loadingContentPanel = false;
                },
                (error) => {
                    this.loadingContentPanel = false;
                    this.errors.push(error.Message);
                }
            );
    }

    deleteBasketRows(lds: any[]) {
        let basketSource = this.basketLV.DataSource;
        return lds.filter((LDRow: any) => {
            return (basketSource || []).find((basketRow: any) => {
                return basketRow.Data['IdLogicDevice'] == LDRow['IdLogicDevice'];
            }) == undefined;
        });
    }

    ldsInit() {
        this.loadData();
        this.initLDExportOptions();

        this.DetailsRowComponents[1].params = { unitId: this.unitId };
    }

    private initDG(lds: any[]) {
        this.dataGrid.initDataGrid();
        this.dataGrid.KeyField = 'IdLogicDevice';
        this.dataGrid.Columns = [{
            Name: "LogicDeviceDisplayText"
        }];

        this.dataGrid.ActionButtons = [
            new DGActionButtom("PropertiesExport", AppLocalization.ExportProps),
            new DGActionButtom(
                "Delete", 
                AppLocalization.Delete,
                new DGActionButtonConfirmSettings(AppLocalization.DeleteConfirm, AppLocalization.Delete)
            )
        ];
        // delete button access
        this.dataGrid.ActionButtons[1].IsValid = (data: any) => {
            if (data.IsValid == null) {
                this.permissionCheck.checkAuthorization(
                    Object.assign(new AccessDirectiveConfig(), { keySource: data.IdLogicDevice, source: 'LogicDevices', value: 'OE_DELETE_EQUIPMENT' })
                )
                .pipe(
                    observeOn(queueScheduler)
                )
                .subscribe((authorized) => {
                        data.IsValid = authorized;
                    }
                );
            }
            return data.IsValid;
        };
        
        let statusColumn = new GridControls.StatusColumn();
        statusColumn.Field = "LogicObjectStatuses";
        statusColumn.KeyColor = "Color";
        statusColumn.KeyDesc = "Desc";
        this.dataGrid.StatusColumn = statusColumn;

        this.dataGrid.DataSource = lds;
    }
    //проверка доступности кнопок анализ и отчет
    private accessBasketInit(): void {

        this.loadingCheckAccessCommand = true;

        this.currentUserService.checkPermissionLogicDeviceIds(this.getLogicDeviceIds())
            .finally(() => this.loadingCheckAccessCommand = false)
            .then((results: any[]) => {

                this.isBasketAnalyzeNotAccess = ((results || []).find(a => a === 'DA_START') == null);
                this.isBasketReportNotAccess = ((results || []).find(a => a === 'DR_START') == null);
                this.isBasketDataNotAccess = ((results || []).find(a => a === 'DP_ALLOW') == null);

            })
            .catch((error) => {
                this.errors.push(error);
            });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Инициализация объекта статусов AllStatusesObjects и обработчик их отображений
    public AllStatusesObjects: any = {};

    public onGridStatusMouseEnter(data: any) {
        let item = data.item;
        let statusColumnStruct = <GridControls.StatusColumn>data.statusColumnStruct;
        let value = item[statusColumnStruct.Field];
        if (value) {
            let valChange;
            if (value instanceof Array) {
                if (value.length)
                    valChange = value[0];
            }
            else {
                valChange = value;
            }
            if (valChange && this.AllStatusesObjects) {
                let statusDict = this.AllStatusesObjects[valChange.Id];
                //много привязок на параметры, пересмотреть
                valChange[statusColumnStruct.KeyDesc] = statusDict["ColorDescriptions"][valChange[statusColumnStruct.KeyColor]]["name"];
            }
        }
    }

    private loadStatuses() {
        this.statusesService
            .getStatuses()
            .get()
            .subscribe(
                (data: any) => {
                    data.forEach((elem: any) => {

                        Object.keys(elem.ColorDescriptions)
                            .map(
                                key => {
                                    elem.ColorDescriptions[key] = {
                                        name: elem.ColorDescriptions[key],
                                        color: key
                                    };
                                    elem.color = elem.ColorDescriptions[key].color;
                                });
                        this.AllStatusesObjects[elem.Id] = elem;
                    });
                },
                (error: any) => {
                    this.errors.push(error.Message);
                }
            );
    }

    ngAfterViewInit() {
        this.loadStatuses();
    }

    public createLogicDevice() {
        this.router.navigate(['/ld-editor/new/ld-types'],
            {
                queryParams: { unitId: this.unitId }
            });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Фильтр по статусам
    public statusIdShowPopup: number;
    public nameStatusCategoryField = "ColorDescriptions";
    public getStatusLengthCategory(item: any) {
        return Object.keys(item[this.nameStatusCategoryField]).length;
    }
    public setStatusCategoryCheck(item: any, isCheck: boolean) {
        Object.keys(item[this.nameStatusCategoryField]).forEach(key => {
            item[this.nameStatusCategoryField][key].IsCheck = isCheck;
        });

        this.setStatusLengthCategoryCheck(item);
        this.filterClientDataGrid(item, null);
    }
    private setStatusLengthCategoryCheck(item: any) {
        let isCheck = true;
        let isOneCheck = false;
        Object.keys(item[this.nameStatusCategoryField]).forEach(key => {
            isCheck = isCheck && item[this.nameStatusCategoryField][key].IsCheck;
            isOneCheck = isOneCheck || item[this.nameStatusCategoryField][key].IsCheck;
        });

        item.IsCheck = isCheck;
        item.isOneCheck = isOneCheck;
    }
    public filterClientDataGrid(item: any, category: any, popup: any = null) {
        let colors: string[] = [];
        Object.keys(item[this.nameStatusCategoryField]).forEach(key => {
            if (item[this.nameStatusCategoryField][key].IsCheck) {
                colors.push(item[this.nameStatusCategoryField][key].color);
            }
        });

        if (colors.length) {
            let filter = {};
            filter['LogicObjectStatusesAggregate|Color'] = colors;
            this.dataGrid.Filter = filter;
        } else {
            this.dataGrid.Filter = {};
        }

        if (popup) { this.statusIdShowPopup = null; popup.close(); }
    }
    public categoryCheck(item: any, category: any, event: any) {
        category.IsCheck = !category.IsCheck;

        this.setStatusLengthCategoryCheck(item);
    }
    public clearStatusCategoryCheck(item: any, popup: any = null) {
        this.setStatusCategoryCheck(item, false);
        this.setStatusLengthCategoryCheck(item);

        this.dataGrid.Filter = null;

        if (popup) { this.statusIdShowPopup = null; popup.close(); }
    }
    public clearAllStatusCategoryCheck() {
        Object.keys(this.AllStatusesObjects).forEach(key => {
            this.clearStatusCategoryCheck(this.AllStatusesObjects[key]);
        });
        this.dataGrid.Filter = null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    getLogicDeviceIds() {
        let units: any[] = [];
        (this.basketLV.DataSource || []).forEach(data => {
            if (data.Data['IdLogicDevice'] != null) units.push(data.Data['IdLogicDevice']);
        });
        return units;
    }
    setNewAnalyze() {
        let units = this.getLogicDeviceIds();
        this.setAnalyze({'IdLogicDevice': (units||[]).join()});
    }
    setNewReport() {
        let units = this.getLogicDeviceIds();
        this.setReport({'IdLogicDevice': (units||[]).join()});
    }
    setNewDataCreate() {
        let units = this.getLogicDeviceIds();
        this.setDataCreate({'IdLogicDevice': (units||[]).join()});
    }

    public setAnalyze(item: any) {
        this.equipmentService
            .post({
                ids: item['IdLogicDevice'] //'17018,5699,11262',
            })
            .then(guid => {
                let queryParams = {};
                queryParams['key'] = guid;

                this.router.navigate(
                    ['validation/create'],
                    {
                        queryParams: queryParams
                    }
                );
            })
            .catch(error => this.errors.push(error.Message));
    }

    public setReport(item: any) {
        this.equipmentService
            .post({
                ids: item['IdLogicDevice'] //'17018,5699,11262',
            })
            .then(guid => {
                let queryParams = {};
                queryParams['key'] = guid;

                this.router.navigate(
                    ['reports/create'],
                    {
                        queryParams: queryParams
                    }
                );
            })
            .catch(error => this.errors.push(error.Message));
    }

    public setDataCreate(item: any) {
        this.equipmentService
            .post({
                ids: item['IdLogicDevice'] //'17018,5699,11262',
            })
            .then(guid => {
                let queryParams = {};
                queryParams['key'] = guid;

                this.router.navigate(
                    ['datapresentation/create'],
                    {
                        queryParams: queryParams
                    }
                );
            })
            .catch(error => this.errors.push(error.Message));
    }

    public onApplyFilter(guid: string): void {
        this.cacheFilter = guid;
        this.loadData();
    }
}