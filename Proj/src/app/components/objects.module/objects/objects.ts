import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, ViewChild, OnInit, AfterViewInit, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { finalize } from "rxjs/operators";

import { DataObjectsService } from '../../../services/objects.module/DataObjects.service';
import { EquipmentService } from '../../../services/common/Equipment.service';
import { ObjectInjectService } from './object.service';
import { GlobalValues } from '../../../core';

import { FilterObjectsContainerService } from '../../../services/objects.module/Filters/FilterContainer.service';
import { ValidationCreateTemplateService } from '../../../services/validation.module/ValidationCreateTemplate.service';

import { ObjectTable } from '../../../services/common/Models/ObjectTable';
import * as DataObjectNamespace from '../../../services/objects.module/Models/DataObject';

import * as GridControls from '../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import DGSelectionRowMode = GridControls.SelectionRowMode;
import DGActionButtom = GridControls.ActionButtons;
import DGActionButtonConfirmSettings = GridControls.ActionButtonConfirmSettings;
import * as NavigateControls from '../../../controls/Navigate/Navigate';
import { Navigate } from '../../../common/models/Navigate/Navigate';
import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';

import { PropertiesPanelComponent } from "../../../shared/rom-forms/index";
import { DetailsRowComponent } from "../../../controls/ListComponentCommon/DetailsRow/DetailsRow";

declare var $: any;

enum FieldNameKey { Key, DisplayText, Address, Status, StatusAggregate }

export const keyStorageBasketName = 'ObjectsComponent.storageBrowserCachedJobObjects';

import { EntityType } from "../../../services/common/Properties.service";

import { ObjectEditorService } from "../../../services/objecteditors.module/object.editor/ObjectEditor.service";

import { PermissionCheck } from "../../../core";
import { CurrentUserService } from '../../../services/authorization.module/current.user.service';
import { DataGridCurrentItemService } from '../../../core';

@Component({
    selector: 'frame-objects',
    templateUrl: 'objects.html',
    styleUrls: ['objects.css']
})

export class ObjectsComponent implements OnInit, AfterViewInit {

    public menuTabHeader: NavigateItem[] = [];
    get navigate() {
        return GlobalValues.Instance.Navigate;
    }
    set navigate(nav: Navigate) {
        GlobalValues.Instance.Navigate = nav;
    }

    public loadingContentPanel: boolean;
    public loadingValidTemplatePanel: boolean;
    public loadingCheckAccessCommand: boolean;
    public errorsContentForm: any[] = [];
    public errorsBasketForm: any[] = [];
    private expanded_obj: any;
    private filterKey: any;
    public isBasketAnalyzeNotAccess: boolean;
    public isBasketReportNotAccess: boolean;
    public isBasketDataNotAccess: boolean;

    public AllStatusesObjects: any = {};
    FieldNameKey = FieldNameKey;
    BigDataSource: any[];
    LinkUnitsDataSource: any;
    DGSelectionRowMode = DGSelectionRowMode;
    ValidationTemplates: any[] = [];
    DetailsRowComponents: DetailsRowComponent[] = [
            new DetailsRowComponent(AppLocalization.Properties, PropertiesPanelComponent, EntityType.Unit)
        ];
    
    private _isReadTableFromCache = false;//чтобы не фильтровать большой BigDataSource постоянно, для оптимизации делаем это только тогда, когда обновляется кеш
    private _jobObjects: DataObjectNamespace.Services.ObjectsModule.Models.ObjectTableView[] = [];
    get JobObjects(): DataObjectNamespace.Services.ObjectsModule.Models.ObjectTableView[] {

        if (!this._isReadTableFromCache && this.BigDataSource) {
            if (localStorage.getItem(keyStorageBasketName) != null) {
                let selectedCacheRows = JSON.parse(localStorage.getItem(keyStorageBasketName));
                if (selectedCacheRows && selectedCacheRows.length) {
                    //в результате этого кода, если применен фильтр, данные из корзины удаляться полностью, если мы удалим хоть одну запись, не входящую в фильтр - ROM-579
                    //this._jobObjects = this.BigDataSource.filter((x: DataObjectNamespace.Services.ObjectsModule.Models.ObjectTableView) => {
                    //    return selectedCacheRows.find((y: any) => y.IdLogicDevice === x.IdLogicDevice && y.IdUnit === x.IdUnit) != null;
                    //});

                    this._isReadTableFromCache = true;                    
                }
            }
        }

        return this._jobObjects;
    }
    set JobObjects(vals: DataObjectNamespace.Services.ObjectsModule.Models.ObjectTableView[]) {

        this._isReadTableFromCache = false;

        //храним только пару IdUnit | IdLogicDevice, т.к. при 31 000 кеш падает, когда мы пытаемся сохранить весь объект
        localStorage.setItem(keyStorageBasketName, vals != null ? JSON.stringify(vals.map((data: DataObjectNamespace.Services.ObjectsModule.Models.ObjectTableView) => {
            return { IdUnit: data.IdUnit, IdLogicDevice: data.IdLogicDevice }
        })) : null);
                
        this._jobObjects = vals;

        //при добавлении, удалении из корзины, проверять записи, на возможно операций
        if ((vals || []).length) {
            this.accessBasketInit();
        }
    }

    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    @ViewChild('NavigateMenu', { static: true }) navigateMenu: NavigateControls.Navigate;
    
    constructor(public dataSource: DataObjectsService,
                public objInjectService: ObjectInjectService,
                public router: Router,
                public equipmentService: EquipmentService,
                public filterContainerService: FilterObjectsContainerService,
                public validationCreateTemplateService: ValidationCreateTemplateService,
                public objectEditorService: ObjectEditorService,
                public permissionCheck: PermissionCheck,
                public currentUserService: CurrentUserService,
                public dataGridCurrentItemService: DataGridCurrentItemService) {
    }
    
    ngOnInit() {
        this.navigate = this.navigateMenu.navigate;

        let menus: NavigateItem[] = [];
        menus.push(Object.assign(new NavigateItem(), { name: AppLocalization.Objects, code: 'units' }));
        menus.push(Object.assign(new NavigateItem(), { name: AppLocalization.Label32, code: 'logicDevice' }));
        this.menuTabHeader = menus;

        this.loadData();
    }

    ngAfterViewInit(): void {
        this.loadStatuses();
        this.loadValidationTemplate();
    }

    //получение имя поля в зависимости от вкладки
    public getObjectFieldName(fieldKey: FieldNameKey) {
        switch (fieldKey) {
            case FieldNameKey.Key:
                {
                    return this.navigate.selectItem.code === "units" ? "IdUnit" : "IdLogicDevice";
                }
            case FieldNameKey.DisplayText:
                {
                    return this.navigate.selectItem.code === "units" ? "UnitDisplayText" : "LogicDeviceDisplayText";
                }
            case FieldNameKey.Address:
                {
                    return this.navigate.selectItem.code === "units" ? "UnitAdditionalInfo" : "UnitDisplayText";
                }
            case FieldNameKey.Status:
                {
                    return this.navigate.selectItem.code === "units" ? "UnitStatuses" : "LogicObjectStatuses";
                }
            case FieldNameKey.StatusAggregate:
                {
                    return this.navigate.selectItem.code === "units" ? "UnitStatusAggregate" : "LogicObjectStatusesAggregate";
                }
            default:
                {
                    return "";
                }
        }
    }

    private loadStatuses() {
        this.objInjectService.statuses
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
                    this.errorsContentForm.push(error);
                }
            );
    }

    private loadValidationTemplate(p?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.validationCreateTemplateService
                .get()
                .subscribe((data: any[]) => {
                    this.ValidationTemplates = data;
                    if (this.ValidationTemplates) {
                        this.ValidationTemplates = this.ValidationTemplates.sort(((a: any, b: any) => {
                            return a.Id < b.Id ? 1 :
                                a.Id === b.Id ? 0 : -1
                        }));
                    }
                    resolve();
                },
                    (error: string) => {
                        // this.errorsContentForm.push(error);
                        reject();
                    }
                );
        });        
    }

    private loadData(filterKey?: string) {

        this.loadingContentPanel = true;

        this.dataSource
            .get(filterKey)
            .subscribe(
            (data: any[]) => {
                    this.BigDataSource = data; 
                    this.createLinkUnitsGroupItems();
                    this.loadTabData();
                    
                    this.loadingContentPanel = false;
                },
                (error) => {
                    this.loadingContentPanel = false;
                    this.errorsContentForm.push(error);
                }
            );
        
    }
    //создаем ссылки на строки для объектов, обор-я
    private createLinkUnitsGroupItems() {
        if (this.BigDataSource) {
            this.LinkUnitsDataSource = {};
            this.BigDataSource.forEach(x => {
                if (!this.LinkUnitsDataSource[x.IdUnit]) {
                    let treeNode = new TreeNodeObjectDevice();
                    treeNode.Key = x.IdUnit;

                    let treeNodeChild = new TreeNodeObjectDevice();
                    treeNodeChild.Key = x.IdLogicDevice;
                    treeNodeChild.Parent = treeNode;
                    treeNode.Childs = [treeNodeChild];

                    this.LinkUnitsDataSource[x.IdUnit] = treeNode;
                }
                else if (this.LinkUnitsDataSource[x.IdUnit]) {
                    let treeNode = this.LinkUnitsDataSource[x.IdUnit];
                    
                    let treeNodeChild = new TreeNodeObjectDevice();
                    treeNodeChild.Key = x.IdLogicDevice;
                    treeNodeChild.Parent = treeNode;
                    if (!treeNode.Childs) treeNode.Childs = [];
                    treeNode.Childs.push(treeNodeChild);
                }
            });
        }
    }
    private accessDataGridInit(): Observable<boolean[]> {

        const checkAccess = [
            'OE_CREATE_OBJECT'
        ];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[]) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        return forkJoin<boolean>(obsrvs);
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
                this.errorsContentForm.push(error);
            });
    }
    private loadTabData() {
        this.dataGrid.initDataGrid();

        this.dataGrid.KeyField = this.getObjectFieldName(this.FieldNameKey.Key);
        this.dataGrid.Columns = [{
                Name: "UnitDisplayText",
                IsSearch: this.navigate && this.navigate.selectItem.code === "units"
            }, {
                Name: "LogicDeviceDisplayText",
                AggregateFieldName: ["UnitDisplayText"],
                IsSearch: this.navigate && this.navigate.selectItem.code === "logicDevice"
            }, {
                Name: "UnitAdditionalInfo"
            }];

        if (this.navigate && this.navigate.selectItem.code === "units") {

            this.accessDataGridInit().subscribe((results: boolean[]) => {

                if (results[0]) {
                    this.dataGrid.ActionButtons = [
                        new DGActionButtom("unitClone",
                            AppLocalization.Duplicate,
                            new DGActionButtonConfirmSettings(AppLocalization.DuplicateConfirm,
                                AppLocalization.Duplicate))
                    ];
                }

            });

        } else {
            this.dataGrid.ActionButtons = [];
        }

        let statusColumn = new GridControls.StatusColumn();
        statusColumn.Field = this.getObjectFieldName(FieldNameKey.Status);
        statusColumn.KeyColor = "Color";
        statusColumn.KeyDesc = "Desc";

        this.dataGrid.StatusColumn = statusColumn;

        let data: any[] = (this.BigDataSource || []);     
        //нужно срезать BigDataSource по списку из кеша, т.е. то, что в корзине уже, не показывать в таблице        
        if (this.JobObjects && this.JobObjects.length) {
            data = data.filter((x: DataObjectNamespace.Services.ObjectsModule.Models.ObjectTableView) => {
                return this.JobObjects.find((y: any) => y.IdLogicDevice === x.IdLogicDevice && y.IdUnit === x.IdUnit) == null;
            });
        }

        if (this.navigate && this.navigate.selectItem.code === "logicDevice") {
            data = data.filter((x: DataObjectNamespace.Services.ObjectsModule.Models.ObjectTableView) => x.IdLogicDevice != null);
        }
        else if (this.navigate && this.navigate.selectItem.code === "units") {
            //data = Object.keys(this.LinkUnitsDataSource).map(x => this.LinkUnitsDataSource[x]);
            let result: any[] = [];
            let groupUnitIdContains = {};

            data.forEach((unit: any) => {
                if (!groupUnitIdContains[unit.IdUnit]) {
                    groupUnitIdContains[unit.IdUnit] = 1;
                    result.push(unit);
                }
            });

            data = result;
        }

        this.dataGrid.DataSource = data;
    }
    public onDGRowActionBttnClick(button: any) {
        if (button.action === 'unitClone') {
            this.objectEditorService
                .clone(button.item.IdUnit)
                .then((response: number) => {
                    this.permissionCheck.addUnitToPermissions(response)
                      .subscribe(() => {
                        // this.loadData(this.filterKey);
                        const url = `/object-editor/${response}`
                        this.router.navigate([url]);
                      });
                })
                .catch((error: any) => {
                    this.errorsContentForm.push(error);
                });
        }
    }
    private cacheDataGridTabView: any = {};
    /*private cacheDataGrid() {
        if (this.navigate) {
            let rowsSelect = (this.dataGrid.Rows || []).filter(x => x.IsCheck).map(x => x.Data[this.dataGrid.KeyField]);
            let rowsIndeterminate = (this.dataGrid.Rows || []).filter(x => x.IsIndeterminate).map(x => x.Data[this.dataGrid.KeyField]);
            let cache = new CachedDataGrid();
            cache.rowsSelect = rowsSelect;
            cache.rowsIndeterminate = rowsIndeterminate;
            this.cacheDataGridTabView[this.navigate.selectItem.code === "units" ? "logicDevice" : "units"] = cache;
        }
    }*/
    private loadCacheDataGrid() {
        if (this.navigate) {
            let cache = <CachedDataGrid>this.cacheDataGridTabView[this.navigate.selectItem.code];
            if (cache) {
                this.dataGrid.setCheckRows(cache.rowsSelect);
                this.dataGrid.setIndeterminateRows(cache.rowsIndeterminate);
            }
        }
    }
    private addCacheDataGrid(cacheName: string, rowsSelect?: any[], rowsIndeterminate?: any[]) {
        if (this.navigate) {
            //получаем записи из связанного представления
            //let cacheName = this.navigate.selectItem.code === "units" ? "logicDevice" : "units";
            let cache = <CachedDataGrid>this.cacheDataGridTabView[cacheName];
            if (!cache) cache = new CachedDataGrid();

            let concat = (items: any[], mergeItems: any[]): any[] => {

                let results = mergeItems.filter((x: any) => {
                    return items.find(y => y === x) == null;
                });
                return items.concat(results);
            }

            if (rowsSelect) cache.rowsSelect = concat((cache.rowsSelect || []), (rowsSelect));
            if (rowsIndeterminate) cache.rowsIndeterminate = concat((cache.rowsIndeterminate || []), (rowsIndeterminate));

            this.cacheDataGridTabView[cacheName] = cache;
        }
    }
    private deleteCacheDataGrid(cacheName: string, rowsSelect?: any[], rowsIndeterminate?: any[]) {
        if (this.navigate) {
            //получаем записи из связанного представления
            //let cacheName = this.navigate.selectItem.code === "units" ? "logicDevice" : "units";
            let cache = <CachedDataGrid>this.cacheDataGridTabView[cacheName];
            if (!cache) cache = new CachedDataGrid();

            let deleteRows = (items: any[], deleteItems: any[]) => {
                for (let i = items.length - 1; i >= 0; i--) {
                    if (deleteItems.find(x => x === items[i]) != null) {
                        items.splice(i, 1);
                    }
                }
            }

            if (rowsSelect) deleteRows((cache.rowsSelect || []), (rowsSelect));
            if (rowsIndeterminate) deleteRows((cache.rowsIndeterminate || []), (rowsIndeterminate));

            this.cacheDataGridTabView[cacheName] = cache;
        }
    }
    private clearCacheDataGrid() {
        this.cacheDataGridTabView = {};
    }
    private dropCheckDataRow() {
        Object.keys(this.LinkUnitsDataSource)
            .map(key => <TreeNodeObjectDevice>this.LinkUnitsDataSource[key])
            .forEach(node => {
                node.IsCheck = node.IsIndeterminate = false;
                node.Childs.forEach(nc => nc.IsCheck = false);
            });

        this.clearCacheDataGrid();
    }
    private setCheckDataRow(isCheck: boolean, data: any) {
        let key = data["IdUnit"];

        let getChildsNotInBasket = (childs: any[]): any[] => {

            //нужно срезать BigDataSource по списку из кеша, т.е. то, что в корзине уже, не показывать в таблице        
            if (this.JobObjects && this.JobObjects.length) {
                childs = childs.filter((x: TreeNodeObjectDevice) => {
                    return this.JobObjects.find((y: any) => y.IdLogicDevice === x.Key && y.IdUnit === key) == null;
                });
            }
            return childs;
        }

        let unitsTreeNode = <TreeNodeObjectDevice>this.LinkUnitsDataSource[key];
        let childs = getChildsNotInBasket(unitsTreeNode.Childs);
        if (this.navigate && this.navigate.selectItem.code === "units") {
            unitsTreeNode.IsCheck = isCheck;

            childs.forEach(x => x.IsCheck = isCheck);

            let logicDevicesIds = childs.map(x => x.Key);
            if (isCheck) {
                this.addCacheDataGrid("units", [key]);
                this.addCacheDataGrid("logicDevice", logicDevicesIds);
            }
            else {
                this.deleteCacheDataGrid("units", [key], [key]);
                this.deleteCacheDataGrid("logicDevice", logicDevicesIds, logicDevicesIds);
            }
        }
        else {
            let keyRow = data[this.getObjectFieldName(FieldNameKey.Key)];
            let child = childs.find(x => x.Key === keyRow);
            child.IsCheck = isCheck;

            let count = childs.length;
            let selectCount = childs.filter(x => x.IsCheck).length;

            child.Parent.IsIndeterminate = count !== selectCount && selectCount > 0;
            child.Parent.IsCheck = count === selectCount;

            let checkedUnits: any[];
            let indeterminateUnits: any[];
            if (child.Parent.IsCheck) { checkedUnits = [child.Parent.Key]; }
            else if (child.Parent.IsIndeterminate) { indeterminateUnits = [child.Parent.Key]; }

            if (isCheck) {
                this.addCacheDataGrid("units", checkedUnits, indeterminateUnits);
                this.addCacheDataGrid("logicDevice", [keyRow]);
            }
            else {
                this.deleteCacheDataGrid("units", [child.Parent.Key], [child.Parent.Key]);

                if (checkedUnits) this.addCacheDataGrid("units", checkedUnits, undefined);
                else if (indeterminateUnits) this.addCacheDataGrid("units", undefined, indeterminateUnits);

                this.deleteCacheDataGrid("logicDevice", [keyRow]);
            }
        }
    }
    private setDetailRowComponents() {
        let components: DetailsRowComponent[];
        if (this.navigate.selectItem.code === "units") {
            components = [
                new DetailsRowComponent(AppLocalization.Properties, PropertiesPanelComponent, EntityType.Unit)
            ];
        } else {
            components = [
                new DetailsRowComponent(AppLocalization.Properties, PropertiesPanelComponent, EntityType.LogicDevice)
            ];
        }
        this.DetailsRowComponents = components;
    }
    onNavSelectChanged(navItem: any) {
        //this.cacheDataGrid();

        this.dataGrid.DetailRow.closeExpandedRow();
        this.dataGrid.Filter = null;

        this.setDetailRowComponents();

        this.loadTabData();
        this.loadStatuses();
    }
    onGridStatusMouseEnter(data: any) {
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
    onGridRowsSelected(event: any) {
        if (event.isAllItemsSelect) {
                        
            this.loadingContentPanel = true;            
            setTimeout(() => {
                this.dataGrid.getSelectRows().forEach(row => this.setCheckDataRow(row.IsCheck, row.Data));

                this.loadingContentPanel = false;
            }, 0);
        }
        else {
            this.dropCheckDataRow();
        }
    }
    onGridRowClick(row: any | any[]) {
        if (row instanceof Array) {

            this.loadingContentPanel = true;
            setTimeout(() => {
                row.forEach((r: any) => {
                    this.setCheckDataRow(r.IsCheck, r.Data);
                });

                this.loadingContentPanel = false;
            }, 0);
            
        }
        else {
            this.setCheckDataRow(row.IsCheck, row.Data);
        }
    }



    /**
     * РАБОТА С КОРЗИНОЙ ==============================
     */
    public toObjectsPanel() {
        let selectedRows = this.dataGrid.getSelectDataRows().map((item: any) => {
            return Object.assign(new ObjectTable(), item);
        });
        this.convertJobObjects(selectedRows);

        this.loadTabData();
    }

    public clearAllBasket() {
        this.JobObjects = [];        

        this.loadTabData();
    }

    public clearItemsBasket(itemsBasket: any[]) {
        this.JobObjects = itemsBasket;

        this.loadTabData();
    }

    private convertJobObjects(selectedRows: any[]) {
        if (this.navigate.selectItem.code === "units") {
            let key = this.getObjectFieldName(FieldNameKey.Key);            
            let keyDevices: any[] = [];
            selectedRows
                .map(x => <TreeNodeObjectDevice>this.LinkUnitsDataSource[x[key]])
                .forEach(x => {
                    let res = x.Childs.filter(y => y.IsCheck).map(y => ({ unitId: x.Key, logicDevId: y.Key }));
                    keyDevices = keyDevices.concat(res);
                });
            selectedRows = (this.BigDataSource || []).filter((item: any) => {
                return keyDevices
                    .find(x => x.unitId === item[key] && x.logicDevId === item["IdLogicDevice"]) != null;
            });
        }
        let jobObjects = this.JobObjects;
        let countInputItemsBasket = (selectedRows || []).length;
        if (countInputItemsBasket) {
            this.JobObjects = jobObjects.concat(selectedRows);
            this.dropCheckDataRow();
        }
    }
    /**
     * РАБОТА С КОРЗИНОЙ ========= КОНЕЦ ===============
     */


    onGridDataBinding(dataGrid: any): void {
        this.loadCacheDataGrid();
    }

    public onApplyFilter(guid: string): void {
        this.filterKey = guid;
        this.loadData(guid);
    }

    private getDevicesIds(item: any) {
        let key = this.getObjectFieldName(FieldNameKey.Key);
        let id = item[key];

        let ids: string;
        if (this.navigate.selectItem.code === "units") {
            if (this.LinkUnitsDataSource[id] != null) {
                ids = (<TreeNodeObjectDevice>this.LinkUnitsDataSource[id]).Childs.map((node: TreeNodeObjectDevice) => node.Key).join();
            }
        }
        else {
            ids = id;
        }
        return ids;
    }

    public setAnalyzeEx(item: any) {
        this.setAnalyze(this.getDevicesIds(item));
    }

    public setReportEx(item: any) {
        this.setReport(this.getDevicesIds(item));
    }

    public setDataCreateEx(item: any) {
        this.setDataCreate(this.getDevicesIds(item));
    }

    private setAnalyze(ids: string, iTemplate?: number) {

        let queryParams = {};
        if (iTemplate != null) {
            queryParams['template'] = iTemplate;
        }

        this.equipmentService
            .post({
                ids: ids //'17018,5699,11262',
            })
            .then(guid => {

                queryParams['key'] = guid;

                this.router.navigate(
                    ['validation/create'],
                    {
                        queryParams: queryParams
                    }
                );
            })
            .catch(error => this.errorsBasketForm.push(error.Message));;
    }
    private setReport(ids: string) {
        this.equipmentService
            .post({
                ids: ids //'17018,5699,11262',
            })
            .then(guid => {
                this.router.navigate(
                    ['reports/create'],
                    {
                        queryParams: {
                            'key': guid
                        }
                    }
                );
            })
            .catch(error => this.errorsBasketForm.push(error.Message));;
    }

    private setDataCreate(ids: string) {
        this.equipmentService
            .post({
                ids: ids //'17018,5699,11262',
            })
            .then(guid => {
                this.router.navigate(
                    ['datapresentation/create'],
                    {
                        queryParams: {
                            'key': guid
                        }
                    }
                );
            })
            .catch(error => this.errorsBasketForm.push(error.Message));
    }

    private getLogicDeviceIds() {
        let units: any[] = [];
        (this.JobObjects || []).forEach(data => {
            if (data.IdLogicDevice != null) units.push(data.IdLogicDevice);
        });
        return units;
    }
    public setNewAnalyze() {
        let units = this.getLogicDeviceIds();
        this.setAnalyze((units||[]).join());
    }
    public setNewAnalyzeWithTemplate(iTemplate: number) {
        let units = this.getLogicDeviceIds();
        this.setAnalyze((units || []).join(), iTemplate);
    }
    public setNewReport() {
        let units = this.getLogicDeviceIds();
        this.setReport((units || []).join());
    }
    public setNewDataCreate() {
        let units = this.getLogicDeviceIds();
        this.setDataCreate((units || []).join());
    }

    /**
     * Фильтр по статусу, контрол статуса и его проперти
     * 
     * 
     */
    public statusIdShowPopup: number;
    private nameStatusCategoryField = "ColorDescriptions";
    public getStatusLengthCategory(item: any) {
        return Object.keys(item[this.nameStatusCategoryField]).length;
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
    public categoryCheck(item: any, category: any, event: any) {
        category.IsCheck = !category.IsCheck;

        this.setStatusLengthCategoryCheck(item);
    }
    public setStatusCategoryCheck(item: any, isCheck: boolean) {
        Object.keys(item[this.nameStatusCategoryField]).forEach(key => {
            item[this.nameStatusCategoryField][key].IsCheck = isCheck;
        });

        this.setStatusLengthCategoryCheck(item);
        this.filterClientDataGrid(item, null);
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
    public filterClientDataGrid(item: any, category: any, popup: any = null) {
        let fieldName = this.getObjectFieldName(FieldNameKey.StatusAggregate);
        let filter = {};

        let colors: string[] = [];
        Object.keys(item[this.nameStatusCategoryField]).forEach(key => {
            if (item[this.nameStatusCategoryField][key].IsCheck) {
                colors.push(item[this.nameStatusCategoryField][key].color);
            }
        });

        if (colors.length) {
            filter[`${fieldName}|Color`] = colors;
            this.dataGrid.Filter = filter;
        } else {
            this.dataGrid.Filter = {};
        }

        if (popup) { this.statusIdShowPopup = null; popup.close(); }
    }
    /*================END FILTER STATUS===================*/

    deleteValidationTemplate(id: number) {
        this.loadingValidTemplatePanel = true;
        this.validationCreateTemplateService
            .delete(id)
            .then(() => {
                this.loadValidationTemplate()
                    .then(() => this.loadingValidTemplatePanel = false);                
            })
            .catch((error: any) => {
                this.loadingValidTemplatePanel = false;
                this.errorsContentForm.push(error);
            })
    }
}

class CachedDataGrid {
    rowsSelect: any[];
    rowsIndeterminate: any[];
}

class TreeNodeObjectDevice {
    Key: any;
    IsCheck: boolean;

    //св-ва Unit
    IsIndeterminate: boolean;
    Childs: TreeNodeObjectDevice[];
    //св-ва LD
    InBasket: boolean;
    Parent: TreeNodeObjectDevice;    
}
