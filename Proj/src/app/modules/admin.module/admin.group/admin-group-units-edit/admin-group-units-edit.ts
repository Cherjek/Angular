import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { finalize } from "rxjs/operators";

import { AdminGroupService } from "../../../../services/admin.module/admin.group/AdminGroup.service";

import { Navigate } from '../../../../common/models/Navigate/Navigate';
import { NavigateItem } from "../../../../common/models/Navigate/NavigateItem";

import * as GridControls from '../../../../controls/DataGrid';
import DGSelectionRowMode = GridControls.SelectionRowMode;

import { PropertiesPanelComponent } from "../../../../shared/rom-forms";
import { DetailsRowComponent } from "../../../../controls/ListComponentCommon/DetailsRow/DetailsRow";
import { EntityType } from "../../../../services/common/Properties.service";

import { AdminGroupUnitsFilterContainerService } from "../../../../services/admin.module/admin.group/admin.group.units/Filters/AdminGroupUnitsFilterContainer.service";
import * as DataObjectModule from "../../../../services/objects.module/Models/DataObject";
import ObjectTableView = DataObjectModule.Services.ObjectsModule.Models.ObjectTableView;

import { GlobalValues } from '../../../../core';

enum FieldNameKey { Key, DisplayText, Address, Status, StatusAggregate }

@Component({
    selector: 'admin-group-unitsEdit',
    templateUrl: './admin-group-units-edit.html',
    styleUrls: ['./admin-group-units-edit.less']
})
export class AdminGroupUnitsEditComponent implements OnInit, OnDestroy {
    public DGErrors: any[] = [];
    public BasketErrors: any[] = [];
    public loadingDG: boolean;
    public loadingBasket: boolean;
    private urlParamsSubscription: Subscription;

    //private AdditionalInfoField: string = AdditionalInfo;
    public DGSelectionRowMode = DGSelectionRowMode;

    private groupId: string | number;
    //private navItems: NavigateItem[] = [
    //    { name: AppLocalization.Objects, code: 'units' },
    //    { name: 'AppLocalization.Label32', code: 'lds' }
    //];
    public menuTabHeader: NavigateItem[] = [];
    get navigate() {
        return GlobalValues.Instance.Navigate;
    }
    set navigate(nav: Navigate) {
        GlobalValues.Instance.Navigate = nav;
    }

    public pageInitComplete: boolean;
    public FieldNameKey = FieldNameKey;
    private LinkUnitsDataSource: any;
    private BigDGSrc: any[]; // все объекты соответствующие filterKey или OnInit
    public BasketSrc: any[]; // источник данных для корзины
    private LinkEso: any; // ссылка на ESO при получении данных от admin/group/logicDevicesPermissions, берется верхний уровень

    @ViewChild('NavigateMenu', { static: true }) private navigateMenu: any;
    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: any;
    @ViewChild('ObjectsPanel', { static: true }) private basket: any;

    DetailsRowComponents: DetailsRowComponent[] = [
        new DetailsRowComponent(AppLocalization.Properties, PropertiesPanelComponent, EntityType.Unit)
    ];

    constructor(private adminGroupService: AdminGroupService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                public filterContainerService: AdminGroupUnitsFilterContainerService) {

        this.urlParamsSubscription = this.activatedRoute.params.subscribe(
            (params: any) => {
                this.groupId = params['id'];
            }/*,
            (error: any) => {
                this.errors = [error];
            }*/
        );
    }

    ngOnInit() {

        this.navigate = this.navigateMenu.navigate;

        let menus: NavigateItem[] = [];
        menus.push(Object.assign(new NavigateItem(), { name: AppLocalization.Objects, code: 'units' }));
        menus.push(Object.assign(new NavigateItem(), { name: AppLocalization.Label32, code: 'logicDevice' }));
        this.menuTabHeader = menus;

        this.pageInit();
    }

    ngOnDestroy() {
        this.urlParamsSubscription.unsubscribe();
    }

    @HostListener('document:keydown', ['$event']) onKeyDownFilter(event: KeyboardEvent) {
        if (event.ctrlKey) {
            // Ctrl + s = save
            if (event.keyCode === 83) {
                event.preventDefault();
                this.Save();
            }
        } else {
            if (event.keyCode === 27) {
                this.Cancel();
            }
        }
    }

    //создаем ссылки на строки для объектов, обор-я
    private createLinkUnitsGroupItems() {
        if (this.BigDGSrc) {
            this.LinkUnitsDataSource = {};
            this.BigDGSrc.forEach(x => {
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
        }, {
                Name: "EsoName"
        }];

        let data: any[] = (this.BigDGSrc || []);
        //нужно срезать BigDataSource по списку из кеша, т.е. то, что в корзине уже, не показывать в таблице        
        if (this.BasketSrc && this.BasketSrc.length) {
            data = data.filter((x: ObjectTableView) => {
                return this.BasketSrc.find((y: any) => y.IdLogicDevice === x.IdLogicDevice && y.IdUnit === x.IdUnit) == null;
            });
        }

        if (this.navigate && this.navigate.selectItem.code === "logicDevice") {
            data = data.filter((x: ObjectTableView) => x.IdLogicDevice != null);
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

    private loadDataForGrid(filterKey?: string): Observable<any[]> {

        return this.adminGroupService
            .getAllSubscrsAllUnits(this.groupId, filterKey);
    }

    private initBasketSource(trees: any[]): Observable<ObjectTableViewWithEso[]> {

        return new Observable(subscribe => {

            let result = (trees || []).map(eso => {

                    if (this.LinkEso == null) this.LinkEso = {};
                    this.LinkEso[eso.Id] = { ...eso };

                    return (eso.Units || []).map(
                        (unit: any) =>
                        (unit.LogicDevices || []).map(
                            (ld: any) => {

                                return {
                                    IdEso: eso.Id,
                                    EsoName: eso.GeoPath + ', ' + eso.Name,
                                    IdUnit: unit.Id,
                                    UnitDisplayText: unit.DisplayName,
                                    IdLogicDevice: ld.Id,
                                    LogicDeviceDisplayText: ld.DisplayName
                                }
                            })
                    )
                });

            // concat массива внутри массива, [[ [1], [2], [3] ], [ [1], [2], [3] ]] => 
            if (result.length) {
                result = result.reduce((r: any[], list: any[]) => [...r, ...list]);
            }
            // concat всех полученных массивов, [ [1], [2], [3], [1], [2], [3] ]
            if (result.length) {
                result = result.reduce((r: any[], list: any[]) => [...r, ...list]);
            }

            subscribe.next(result);
            subscribe.complete();
        });
    }

    private initDataGridSource(units: any[]): Observable<ObjectTableViewWithEso[]> {
        return new Observable((subscribe) => {

            const result = (units || []).map(
                    (unit: any) =>
                    (unit.LogicDevices || []).map(
                        (ld: any) => {
                            if(this.LinkEso[unit.IdEso]) {
                            const data = new ObjectTableViewWithEso(unit.Id, ld.Id, unit.DisplayName, ld.DisplayName, unit.UnitAdditionalInfo);
                            data.IdEso = unit.IdEso;
                            data.EsoName = this.LinkEso[unit.IdEso].GeoPath + ', ' + this.LinkEso[unit.IdEso].Name;

                            return data;
                            }
                        }).filter((x: any) => x)
                )
                //concat всех полученных массивов, [ [1], [2], [3], [1], [2], [3] ]
                .reduce((r: any[], list: any[]) => [...r, ...list]);

            subscribe.next(result);
            subscribe.complete();
        });
    }

    private loadTable(filterKey?: string): Promise<boolean> {
        this.loadingDG = true;

        return new Promise((resolve, reject) => {

            this.loadDataForGrid(filterKey)
                .pipe(
                    finalize(() => {
                        this.loadingDG = false;
                    })
                )
                .subscribe((tables: any[]) => {
                    this.initDataGridSource(tables)
                        .subscribe(result => {
                            this.BigDGSrc = result;
                            this.createLinkUnitsGroupItems();
                        });

                    this.loadTabData();

                    resolve(true);

                }, (error: any) => {
                    this.DGErrors = [error];

                    reject();
                });

        });

        
    }

    private pageInit() {

        this.loadingDG = true;
        this.loadingBasket = true;

        this.adminGroupService
            .getSubscribers(this.groupId)
            .pipe(
                finalize(() => {
                    this.loadingBasket = false;
                })
            )
            .subscribe((trees: any[]) => {
                    
                    if (trees && trees.length) {
                        this.initBasketSource(trees)
                            .subscribe((results: ObjectTableViewWithEso[]) => {
                                
                                this.BasketSrc = results;

                                this.loadTable()
                                    .then(() => this.pageInitComplete = true);
                                
                            });
                    } else {
                        this.loadingDG = false;                    
                    }
                },
                (error: any) => {
                    this.BasketErrors = [error];
                    
                }
            );
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

    public onNavSelectChanged(navItem: any) {
        //this.cacheDataGrid();

        this.dataGrid.DetailRow.closeExpandedRow();
        this.dataGrid.Filter = null;

        this.setDetailRowComponents();

        this.loadTabData();
    }

    /* CHECK */
    private cacheDataGridTabView: any = {};
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
            if (this.BasketSrc && this.BasketSrc.length) {
                childs = childs.filter((x: TreeNodeObjectDevice) => {
                    return this.BasketSrc.find((y: any) => y.IdLogicDevice === x.Key && y.IdUnit === key) == null;
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
    /* END CHECK */

    onGridRowsSelected(event: any) {
        if (event.isAllItemsSelect) {

            this.loadingDG = true;
            setTimeout(() => {
                this.dataGrid.Rows.forEach((row: any) => this.setCheckDataRow(row.IsCheck, row.Data));

                this.loadingDG = false;
            }, 0);
        }
        else {
            this.dropCheckDataRow();
        }
    }
    onGridRowClick(row: any | any[]) {
        if (row instanceof Array) {

            this.loadingDG = true;
            setTimeout(() => {
                row.forEach((r: any) => {
                    this.setCheckDataRow(r.IsCheck, r.Data);
                });

                this.loadingDG = false;
            }, 0);

        }
        else {
            this.setCheckDataRow(row.IsCheck, row.Data);
        }
    }
    onGridDataBinding(dataGrid: any): void {
        this.loadCacheDataGrid();
    }
    /**
     * РАБОТА С КОРЗИНОЙ ==============================
     */
    public toObjectsPanel() {
        let selectedRows = this.dataGrid.getSelectDataRows().map((item: any) => {
            return { ...item };
        });
        this.convertJobObjects(selectedRows);

        this.loadTabData();
    }

    private clearAllBasket() {
        this.BasketSrc = [];

        this.loadTabData();
    }

    public clearItemsBasket(itemsBasket: any[]) {
        this.BasketSrc = itemsBasket;

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
            selectedRows = (this.BigDGSrc || []).filter((item: any) => {
                return keyDevices
                    .find(x => x.unitId === item[key] && x.logicDevId === item["IdLogicDevice"]) != null;
            });
        }
        let jobObjects = this.BasketSrc;
        let countInputItemsBasket = (selectedRows || []).length;
        if (countInputItemsBasket) {
            this.BasketSrc = jobObjects.concat(selectedRows);
            this.dropCheckDataRow();
        }
    }
    /**
     * РАБОТА С КОРЗИНОЙ ========= КОНЕЦ ===============
     */

    public dropWholeBasket() {
        this.BasketSrc = [];

        this.loadTabData();
    }

    public onApplyFilter(guid: string): void {
        this.loadTable(guid);
    }

    public Cancel() {
        this.goBack();
    }

    public Save() {

        this.loadingBasket = true;
        this.loadingDG = true;

        const esos: any[] = [];
        this.BasketSrc.forEach((item: ObjectTableViewWithEso) => {

            let eso = esos.find((e: any) => e.Id === item.IdEso);
            if (!eso) {
                const length = esos.push({ Id: item.IdEso });
                eso = esos[length - 1];
            }

            if (!eso.Units) {
                eso.Units = [];
            }

            let unit = eso.Units.find((u: any) => u.Id === item.IdUnit);
            if (!unit) {
                const length = eso.Units.push({ Id: item.IdUnit });
                unit = eso.Units[length - 1];
            }

            if (!unit.LogicDevices) {
                unit.LogicDevices = [];
            }

            //let logicDevice = unit.LogicDevices.find((ld: any) => ld.Id === item.IdLogicDevice);
            unit.LogicDevices.push({ Id: item.IdLogicDevice });

        });

        this.adminGroupService
            .postSubscribers(this.groupId, esos)
            .then((result: any) => {
                this.loadingBasket = false;
                this.loadingDG = false;
                this.goBack();
            })
            .catch((error: any) => {
                this.loadingBasket = false;
                this.loadingDG = false;
                this.BasketErrors = [error];
            });
    }

    goBack() {
        this.router.navigate(['../units'], {
            relativeTo: this.activatedRoute,
        })
    }
}

class ObjectTableViewWithEso extends ObjectTableView {
    IdEso: number;
    EsoName: string;
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
