import { AppLocalization } from 'src/app/common/LocaleRes';
import { HierarchyMapComponent } from './../hierarchy-map/hierarchy-map.component';
import { Component, ViewChild, OnInit, AfterViewInit, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { finalize, delay } from 'rxjs/operators';

import { CurrentUserService } from '../../../../services/authorization.module/current.user.service';
import { HierarchyFilterContainerService } from '../../../../services/hierarchy-main/Filters/HierarchyFilterContainer.service';
import { HierarchyMainService } from '../../../../services/hierarchy-main';
import { IHierarchy, 
         IHierarchyNodeView, 
         IHierarchyLogicDeviceView, 
         HierarchyLogicDeviceView,
         Node,
         HierarchyLogicDeviceNodeView,
         HierarchyCardService } from '../../../../services/additionally-hierarchies';

import { GlobalValues, PermissionCheck, DataGridCurrentItemService, Utils } from '../../../../core';

import { EquipmentService } from '../../../../services/common/Equipment.service';
import { DataQueryService, IData } from '../../../../services/data-query';
import { ValidationCreateTemplateService } from '../../../../services/validation.module/ValidationCreateTemplate.service';

import * as GridControls from '../../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import DGSelectionRowMode = GridControls.SelectionRowMode;
import DGActionButtom = GridControls.ActionButtons;
import DataGridRow = GridControls.DataGridRow;
import DGActionButtonConfirmSettings = GridControls.ActionButtonConfirmSettings;
import * as NavigateControls from '../../../../controls/Navigate/Navigate';
import { Navigate } from '../../../../common/models/Navigate/Navigate';
import { NavigateItem } from '../../../../common/models/Navigate/NavigateItem';

import { EntityType } from '../../../../services/common/Properties.service';
import { PropertiesPanelComponent } from '../../../../shared/rom-forms';
import { PropertyComponent as PropertyNodeCardComponent } 
        from '../../../additionally-hierarchies/node-card/components/property/property.component';
import { DetailsRowComponent } from '../../../../controls/ListComponentCommon/DetailsRow/DetailsRow';

import { ListTreeItem, TreeListItem, TreeListCheckedService } from '../../../../shared/rom-forms/treeList.checked.panel';
import { HierarchyDefFiltersService } from '../../../../services/hierarchy-main/Filters/HierarchyDefFilters.service';
import { HierarchyMainStatesService } from '../../../../services/hierarchy-main/hierarchy-main-states.service';
import { HierarchyDataState } from '../../../../services/hierarchy-main/Models/HierarchyDataState';
import { FilterStateService } from './services/filter-state.service';
import { MapData } from 'src/app/services/hierarchy-main/Models/MapData';
import { TariffCalculationTemplateService } from 'src/app/services/taiff-calculation/tariff-calculation-template/tariff-calculation-template.service';

declare var $: any;

enum FieldNameKey { Key, DisplayText, Address }
const tabNodesName = 'nodes';
const childDataName = 'LogicDevices';
export type HierarchyLogicDeviceNodeViewState = HierarchyLogicDeviceNodeView & { SubSystemsStates: HierarchyDataState[] };
export type IHierarchyNodesView = IHierarchyNodeView & { Nodes: Node[], SubSystemsStates: HierarchyDataState[] };

export const keyStorageBasketName = 'HierarchyMainComponent.storageBrowserCachedJobObjects';
export const currentNavKey = 'HierarchyMainComponent.storageHierarchyMainNavItem';
export const filterJournalValuesKey = 'HierarchyMainComponent.storageFilterJournalValues';

@Component({
    selector: 'rom-hierarchy-main',
    templateUrl: './hierarchy-main.component.html',
    styleUrls: ['./hierarchy-main.component.less'],
    providers: [TreeListCheckedService, HierarchyCardService, TariffCalculationTemplateService]
})
export class HierarchyMainComponent implements OnInit {
    isMap = false;
    initialLoad = true;
    public menuTabHeader: NavigateItem[] = [];
    get navigate() {
        return GlobalValues.Instance.Navigate;
    }
    set navigate(nav: Navigate) {
        GlobalValues.Instance.Navigate = nav;
    }

    public loadingValidTemplatePanel = false;
    public changeDetection: string;
    public loadingContentPanel = false;
    public loadingCheckAccessCommand: boolean;
    public errorsContentForm: any[] = [];
    public errorsBasketForm: any[] = [];
    public changeHierarchyComplete = false;
    public hierarchyEmty = false;
    public isBasketAnalyzeNotAccess: boolean;
    public isBasketReportNotAccess: boolean;
    public isBasketDataNotAccess: boolean;
    public isBasketDataQueryNotAccess: boolean;
    public isBasketCommandNotAccess: boolean;
    public isBasketTariffCalcNotAccess: boolean;
    public FieldNameKey = FieldNameKey;
    DGSelectionRowMode = DGSelectionRowMode;
    DetailsRowComponents: DetailsRowComponent[] = [];
    private filterKey: string;
    public treeListItems: TreeListItem[];

    public hierarchies: IHierarchy[];
    public get hierarchySelect(): IHierarchy {
        return GlobalValues.Instance.hierarchyApp;
    }
    public set hierarchySelect(val: IHierarchy) {
        GlobalValues.Instance.hierarchyApp = val;
    }
    bigDataSource: MapData;
    public basketItems: IHierarchyNodeView[];
    public dataQueueTemplates: any[] = [];
    public validationTemplates: any[] = [];
    public tariffCalculationTemplates: any[] = [];
    nodesArray: Node[][] = [];
    globalFilterState: any;

    @ViewChild('Ro5DataGrid', { static: false }) dataGrid: DataGrid;
    @ViewChild('NavigateMenu', { static: false }) navigateMenu: NavigateControls.Navigate;
    @ViewChild('romMapComp', { static: false }) romMapComp: HierarchyMapComponent;

    constructor(public router: Router,
                public permissionCheck: PermissionCheck,
                public currentUserService: CurrentUserService,
                public equipmentService: EquipmentService,
                public hierarchyMainService: HierarchyMainService,
                public hierarchyMainStatesService: HierarchyMainStatesService,
                public filterStateService: FilterStateService,
                public hierarchyDefFiltersService: HierarchyDefFiltersService,
                public hierarchyFilterContainerService: HierarchyFilterContainerService,
                public dataQueryService: DataQueryService,
                public validationCreateTemplateService: ValidationCreateTemplateService,
                public treeListCheckedService: TreeListCheckedService,
                public nodeTreeService: HierarchyCardService,
                public utilsTree: Utils.UtilsTree,
                public tariffCalculationTemplateService: TariffCalculationTemplateService) { 
        
        this.treeListCheckedService.childDataName = childDataName;
    }

    ngOnInit() {
        this.loadHierarchies();
        this.loadDataQueueTemplate();
        this.loadValidationTemplate();
        this.loadTariffCalculationTemplate();
    }

    private initMenu() {
        this.navigate = this.navigateMenu.navigate;

        const nav = localStorage.getItem(currentNavKey);

        const menues: NavigateItem[] = [];
        menues.push(
          Object.assign(new NavigateItem(), {
            name: this.hierarchySelect.NodesName,
            code: tabNodesName,
            isActive: nav === tabNodesName
          })
        );
        menues.push(
          Object.assign(new NavigateItem(), {
            name: AppLocalization.Label32,
            code: 'logicDevice',
            isActive: nav === 'logicDevice'
          })
        );
        this.accessInit().subscribe(result => {
          if (result[0]) {
            menues.push(
              Object.assign(new NavigateItem(), {
                name: AppLocalization.Map,
                code: 'maps',
                isActive: nav === 'maps'
              })
            );
          }
          this.menuTabHeader = menues;
        });
    }

    private initTreeListItems() {
        this.treeListItems = [];
        this.treeListItems.push(new TreeListItem(this.hierarchySelect.NodesName));
        this.treeListItems.push(new TreeListItem(AppLocalization.Label32));
    }

    private loadHierarchies() {
        this.loadingContentPanel = true;

        this.hierarchyMainService
            .getHierarchies()
            .pipe(
                finalize(() => {
                    this.loadingContentPanel = false;
                })
            )
            .subscribe(
            (data: IHierarchy[]) => {
                    this.hierarchies = data;
                    if (data.length) {
                        if (!Object.keys(this.hierarchySelect).length) {
                            this.hierarchySelect = data[0];
                        }

                        this.changeHierarchy();
                    } else {
                        this.hierarchyEmty = true;
                    }
                },
                (error) => {
                    this.errorsContentForm = [error];
                }
            );
    }

    public changeHierarchy() {
        this.changeHierarchyComplete = false;

        const observ = new Observable(subscribe => {
            subscribe.next();
            subscribe.complete();
        });
        observ
            .pipe(
                delay(1000),
                finalize(() => {
                    this.hierarchyFilterContainerService.updateIdHierarchy(this.hierarchySelect.Id);

                    this.changeHierarchyComplete = true;
                    this.filterKey = null;
                    this.basketItems = [];
                    this.initMenu();
                    this.initTreeListItems();
                    this.loadData(true);
                })
            )
            .subscribe();
    }

    // создаем ссылки на строки для объектов, обор-я
    private createLinkNodesGroupItems(data: IHierarchyNodeView[]) {
        if (data) {
            this.treeListCheckedService.initTree<IHierarchyNodeView>(data);
        }
    }

    private loadData(isNavSelect = false) {
        const observs = [];
        this.loadingContentPanel = true;

        observs.push(this.hierarchyDefFiltersService
            .getNodes(this.hierarchySelect.Id, this.filterKey));
        observs.push(this.nodeTreeService.getNodeTree(this.hierarchySelect.Id));
        forkJoin(observs)
            .subscribe(
            (data) => {
                    const hierarchyData = data[0] as IHierarchyNodeView[];
                    const nodesData = data[1]  as Node[];
                    
                    const nodesIds = (hierarchyData || []).map(x => x.Id);
                    const logicDevices = ((hierarchyData || []) as IHierarchyNodeView[]).map(
                      (node: IHierarchyNodeView) => node.LogicDevices
                    );
                    let logicDevicesIds: number[] = [];
                    if (logicDevices.length) {
                      logicDevicesIds = ((logicDevices || []).reduce((r: HierarchyLogicDeviceView[], list: HierarchyLogicDeviceView[]) => {
                        if (list != null && list.length === 0) {
                            return r;
                        } else {
                            return [...r, ...list];
                        }
                      }) || []).map(x => x.Id);
                    }
                    type hierarchyDataStateResult = { nodesStates: any, logicDevicesStates: any };
                    this.hierarchyMainStatesService
                       .loadHierarchyDataState(
                         this.hierarchySelect.Id, 
                         nodesIds,
                         logicDevicesIds
                        )
                      .subscribe((resultHierarchyDataStates: hierarchyDataStateResult) => {

                        (hierarchyData || []).forEach(
                            (node: IHierarchyNodesView) => {
                                node.SubSystemsStates = resultHierarchyDataStates.nodesStates[`${node.Id}`];  
                                
                                //test
                                const get_random = function (list: any[]) {
                                 return list[Math.floor((Math.random()*list.length))];
                                }                                
                                // const _subSystemsStates = [
                                //   {
                                //     IdSubSystem: 1,
                                //     IdStateType: get_random([1,2,3]),
                                //     IsDataRotten: get_random([true,false]),
                                //     Acknowledged: false
                                //   },
                                //   {
                                //     IdSubSystem: 3,
                                //     IdStateType: get_random([1,2,3]),
                                //     IsDataRotten: get_random([true,false]),
                                //     Acknowledged: false
                                //   },
                                //   {
                                //     IdSubSystem: 11,
                                //     IdStateType: get_random([1,2,3]),
                                //     IsDataRotten: get_random([true,false]),
                                //     Acknowledged: false
                                //   }
                                // ];
                                // node.SubSystemsStates = _subSystemsStates;
                                // node.SubSystemsStates.length = get_random([0,1,2,3]);                                
                                
                                node.Nodes = this.getNodes(nodesData, node.Id);
                                node.LogicDevices = node.LogicDevices.map(ld => {
                                        const logicDeviceView = <HierarchyLogicDeviceNodeViewState>Object.assign(new HierarchyLogicDeviceNodeView(), ld);
                                        logicDeviceView.IdNodeView = node.Id;
                                        logicDeviceView.DisplayNameNodeView = node.DisplayName;
                                        const res = this.getNodes(nodesData, node.Id);
                                        logicDeviceView.Nodes = res;
                                        this.nodesArray = [];
                                        logicDeviceView.SubSystemsStates = resultHierarchyDataStates.logicDevicesStates[`${ld.Id}`];
                                        
                                        // test
                                        // const _subSystemsStates = [
                                        //  {
                                        //    IdSubSystem: 1,
                                        //    IdStateType: get_random([1,2,3]),
                                        //    IsDataRotten: get_random([true,false]),
                                        //    Acknowledged: false
                                        //  },
                                        //  {
                                        //    IdSubSystem: 3,
                                        //    IdStateType: get_random([1,2,3]),
                                        //    IsDataRotten: get_random([true,false]),
                                        //    Acknowledged: true
                                        //  },
                                        //  {
                                        //    IdSubSystem: 11,
                                        //    IdStateType: get_random([1,2,3]),
                                        //    IsDataRotten: get_random([true,false]),
                                        //    Acknowledged: true
                                        //  }
                                        // ];
                                        // logicDeviceView.SubSystemsStates = _subSystemsStates;
                                        // logicDeviceView.SubSystemsStates.length = get_random([0,1,2,3]);

                                        return logicDeviceView;
                                    }
                                );
                                this.nodesArray = [];
                            }
                        );
                        this.bigDataSource = {
                            data: hierarchyData,
                            subSystems: this.hierarchyMainStatesService.subSystems,
                            stateType: this.hierarchyMainStatesService.stateType

                        };
                        if (isNavSelect) { this.navSelectFromLocal(); }
                        this.loadTabData(true);

                        this.loadingContentPanel = false;

                      }, (error) => {
                        this.loadingContentPanel = false;
                        this.errorsContentForm.push(error);
                      });                    
                },
                (error) => {
                    this.loadingContentPanel = false;
                    this.errorsContentForm.push(error);
                }
            );

    }

    private getNodes(nodesData: Node[], Id: number) {
        const res = this.findNode(nodesData, [], Id);
        res.splice(res.findIndex(x => x.Id === Id) + 1);
        return res;
    }

    private findNode(nodes: Node[], nodePath: Node[], Id: number) {
        this.groupNodes(nodes, nodePath);
        return this.nodesArray.find(arr => arr.find(x => x.Id === Id));
    }

    private groupNodes(nodes: Node[], nodePath: Node[]) {
        for (let i = 0; i < nodes.length; i++) {
            const element = nodes[i];
            nodePath.push(element);
            if (element.Nodes.length) {
                this.groupNodes(element.Nodes, nodePath);
            }
            this.nodesArray.push([...nodePath]);
            nodePath.pop();
        }
    }

    public goToJournal(item: IHierarchyNodesView | HierarchyLogicDeviceNodeViewState, acknowledged = 0) {
      let logicDevicesFilterValues;
      let subSystemsStatesFilterValues;
      if (this.isNodesTab()) {
        logicDevicesFilterValues = ((item as IHierarchyNodesView).LogicDevices || []).map(x => ({ Id: x.Id, Name: x.DisplayName }));
      } else {
        logicDevicesFilterValues = [{ Id: item.Id, Name: item.DisplayName }];
      }
      if (item.SubSystemsStates) {
        subSystemsStatesFilterValues = item.SubSystemsStates.map(x => {
          return this.hierarchyMainStatesService.subSystems.find(sb => x.IdSubSystem === sb.Id);
        });
      }
      const filterContainer = localStorage.getItem(filterJournalValuesKey) != null ? 
        JSON.parse(localStorage.getItem(filterJournalValuesKey)) : {};
      
      const filter = {
        SubSystem: subSystemsStatesFilterValues,
        LogicDevice: logicDevicesFilterValues,
        Acknowledged: acknowledged ? acknowledged : undefined
      };
      const time = Date.now();
      filterContainer[time] = filter;
      localStorage.setItem(filterJournalValuesKey, JSON.stringify(filterContainer));
      // this.router.navigate([`journals/events`], { queryParams: { mode: 'filter' } });
      
      window.open(`journals/events?filter=${time}`);
    }

    public onNavSelectChanged(navItem: any) {

        this.checkIsMap(navItem.code);

        this.dataGrid.DetailRow.closeExpandedRow();
        this.dataGrid.Filter = null;
        // this.basketItems = null;

        this.setDetailRowComponents();

        this.loadTabData();
        this.saveCurrentNav(navItem);
    }

    private setDetailRowComponents() {
        let components: DetailsRowComponent[];
        if (this.isNodesTab()) {
            components = [
                new DetailsRowComponent(AppLocalization.Properties, PropertyNodeCardComponent)
            ];
        } else {
            components = [
                new DetailsRowComponent(AppLocalization.Properties, PropertiesPanelComponent, EntityType.LogicDevice)
            ];
        }
        this.accessInit().subscribe(result => {
            if (result[1]) {
            this.DetailsRowComponents = components;
            }
        });
    }

    public isNodesTab = () => this.navigate.selectItem.code === tabNodesName;
    public isMapTab = () => this.navigate.selectItem.code === 'maps';

    // получение имя поля в зависимости от вкладки
    public getObjectFieldName(fieldKey: FieldNameKey) {
        switch (fieldKey) {
            case FieldNameKey.Key:
                {
                    return this.navigate.selectItem.code === tabNodesName ? 'Id' : 'Id';
                }
            case FieldNameKey.DisplayText:
                {
                    return this.navigate.selectItem.code === tabNodesName ? 'DisplayName' : 'DisplayName';
                }
            case FieldNameKey.Address:
                {
                    return this.navigate.selectItem.code === tabNodesName ? '' : 'UnitDisplayName';
                }
            default:
                {
                    return '';
                }
        }
    }

    private accessInit(): Observable<boolean[]> {

      const checkAccess = [
          'MAP_HIERARCHY_ALLOW',
          'HH_SETTINGS'
      ];
  
      const obsrvs: any[] = [];
      checkAccess.forEach((access: string | string[]) => {
          obsrvs.push(this.permissionCheck.checkAuthorization(access));
      });
  
      return forkJoin<boolean>(obsrvs);
    }

    // проверка доступности кнопок анализ и отчет
    private accessBasketInit(): void {

        if (this.basketItems == null || !this.basketItems.length) {
            return;
        }

        this.loadingCheckAccessCommand = true;

        this.currentUserService.checkPermissionLogicDeviceIds(this.getLogicDeviceIds())
            .finally(() => this.loadingCheckAccessCommand = false)
            .then((results: any[]) => {

                this.isBasketAnalyzeNotAccess = ((results || []).find(a => a === 'DA_START') == null);
                this.isBasketReportNotAccess = ((results || []).find(a => a === 'DR_START') == null);
                this.isBasketDataNotAccess = ((results || []).find(a => a === 'DP_ALLOW') == null);
                this.isBasketDataQueryNotAccess = ((results || []).find(a => a === 'DQ_START') == null);
                this.isBasketCommandNotAccess = ((results || []).find(a => a === 'CMD_START') == null);
                this.isBasketTariffCalcNotAccess = ((results || []).find(a => a === 'TC_START') == null);

            })
            .catch((error) => {
                this.errorsContentForm.push(error);
            });
    }
    private loadTabData(createTreeLink = false) {
        if(this.dataGrid) {
        this.dataGrid.initDataGrid();

        this.dataGrid.KeyField = this.getObjectFieldName(this.FieldNameKey.Key);
        this.dataGrid.Columns = [{
                Name: this.getObjectFieldName(this.FieldNameKey.DisplayText),
                // IsSearch: this.navigate && this.navigate.selectItem.code === 'units'
            }, /*{
                Name: 'LogicDeviceDisplayText',
                AggregateFieldName: ['UnitDisplayText'],
                IsSearch: this.navigate && this.navigate.selectItem.code === 'logicDevice'
            },*/ {
                Name: 'DisplayNameNodeView'
            }];

        const data: IHierarchyNodeView[] = (this.bigDataSource.data || []);

        // нужно срезать BigDataSource по списку из кеша, т.е. то, что в корзине уже, не показывать в таблице
        let dataResult: IHierarchyNodeView[] | IHierarchyLogicDeviceView[] = this.getDataSourceClone(data);
        this.utilsTree.excludeTree(this.basketItems, dataResult, 'Id', childDataName);

        // формируем дерево для чекбоксов и связей
        if (createTreeLink) {
            this.createLinkNodesGroupItems(dataResult as IHierarchyNodeView[]);
        }

        if (this.navigate.selectItem.code === tabNodesName) {
        } else {
            const result = ((dataResult || []) as IHierarchyNodeView[]).map(
                (node: IHierarchyNodeView) => node.LogicDevices
            );
            if (result != null && result.length) {
                // concat всех полученных массивов, [ [1], [2], [3], [1], [2], [3] ]
                dataResult = result.reduce((r: HierarchyLogicDeviceView[], list: HierarchyLogicDeviceView[]) => {
                    if (list != null && list.length === 0) {
                        return r;
                    } else {
                        return [...r, ...list];
                    }
                });
            }
        }

        this.dataGrid.DataSource = this.filterStateService.applyFilter(this.globalFilterState, dataResult as IHierarchyNodesView[] | HierarchyLogicDeviceNodeViewState[]);
        if(!this.initialLoad) {
            this.romMapComp.filterItems(this.globalFilterState);
        }
        this.initialLoad = false;
        }
    }

    private loadCacheDataGrid() {
        let level = 0;
        if (!this.isNodesTab()) {
            level = 1;
        }
        const indeterminateItems = this.treeListCheckedService.getIndeterminateItems(level).map(item => item.Data[this.dataGrid.KeyField]);
        const checkItems = this.treeListCheckedService.getCheckItems(level).map(item => item.Data[this.dataGrid.KeyField]);
        this.dataGrid.setCheckRows(checkItems);
        this.dataGrid.setIndeterminateRows(indeterminateItems);
    }

    onGridDataBinding(dataGrid: any): void {
        this.loadCacheDataGrid();
    }
    onGridRowsSelected(event: any) {
        this.onGridRowClick(this.dataGrid.getSelectRows());
    }
    onGridRowClick(row: DataGridRow | DataGridRow[]) {
        if (row instanceof Array) {

            this.loadingContentPanel = true;
            setTimeout(() => {
                this.updateTreeChecked(row);

                this.loadingContentPanel = false;
            }, 0);
        } else {
            this.updateTreeChecked([row]);
        }
    }

    private updateTreeChecked(rowsSelect: DataGridRow[]) {
        let level = 0;
        if (!this.isNodesTab()) {
            level = 1;
        }
        const treeItems = this.treeListCheckedService.mapTreeLevel.get(level);
        treeItems.filter(treeItem => {
            const rowSelect = rowsSelect.find(rs => 
                rs.Data[this.dataGrid.KeyField] == treeItem.Data[this.dataGrid.KeyField]
            );
            const founded = rowSelect != null;
            if (founded) {
                treeItem.IsCheck = rowSelect.IsCheck;
            }
            return founded;
        })
        .forEach(treeItem =>
            this.treeListCheckedService.itemCheckClick(
                treeItem,
                level
            )
        );
    }

    public onApplyFilter(guid: string): void {
        this.filterKey = guid;
        this.loadData();
    }

    private getDataSourceClone(data: IHierarchyNodeView[]): IHierarchyNodeView[] {
        return [...data].map(d => {
            const newNode = {...d};
            newNode.LogicDevices = [...d.LogicDevices];
            return newNode;
        });
    }

    private loadValidationTemplate(p?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.validationCreateTemplateService
                .get()
                .subscribe((data: any[]) => {
                    this.validationTemplates = data;
                    if (this.validationTemplates) {
                        this.validationTemplates = this.validationTemplates.sort(((a: any, b: any) => {
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

    private loadDataQueueTemplate(p?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dataQueryService
                .getQueryTemplates()
                .subscribe((data: IData[]) => {
                    this.dataQueueTemplates = data;
                    if (this.dataQueueTemplates) {
                        this.dataQueueTemplates = this.dataQueueTemplates.sort(((a: IData, b: IData) => {
                            return a.Id < b.Id ? 1 :
                                a.Id === b.Id ? 0 : -1;
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

    private loadTariffCalculationTemplate(p?: any): Promise<any> {
      return new Promise((resolve, reject) => {
          this.tariffCalculationTemplateService
              .getTemplates()
              .subscribe((data: any[]) => {
                  this.tariffCalculationTemplates = data;
                  if (this.tariffCalculationTemplates) {
                      this.tariffCalculationTemplates = this.tariffCalculationTemplates.sort(((a: any, b: any) => {
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

    public setAnalyzeEx(item: any) {
        this.setAnalyze(this.getDevicesIds(item));
    }

    public setReportEx(item: any) {
        this.setReport(this.getDevicesIds(item));
    }

    public setDataCreateEx(item: any) {
        this.setDataCreate(this.getDevicesIds(item));
    }

    public setRequestCreateEx(item: any) {
        this.setRequestCreate(this.getDevicesIds(item));
    }

    public setCommandCreateEx(item: any) {
        this.setCommandCreate(this.getDevicesIds(item));
    }

    public setTKCreateEx(item: any) {
      this.setTKCreate(this.getDevicesNodesIds(item));
    }

    private postLogicDevicesAndRedirect(ids: string, redirecrUrl: string, queryParams?: any, notSeparate?: boolean) {
        const idHierarchy = this.hierarchySelect.Id;
        queryParams = queryParams || {};
        this.equipmentService
            .post({
                ids: ids, //'17018,5699,11262',
                notSeparate: notSeparate
            })
            .then(guid => {

                queryParams.key = guid;

                this.router.navigate(
                    [`hierarchy/${idHierarchy}/${redirecrUrl}`],
                    {
                        queryParams: queryParams
                    }
                );
            })
            .catch(error => this.errorsBasketForm.push(error.Message));
    }
    private setAnalyze(ids: string, iTemplate?: number) {

        const queryParams: any = {};
        if (iTemplate != null) {
            queryParams.template = iTemplate;
        }

        this.postLogicDevicesAndRedirect(ids, 'validation/create', queryParams);
    }
    private setRequest(ids: string, iTemplate?: number) {

        const queryParams: any = {};
        if (iTemplate != null) {
            queryParams.template = iTemplate;
        }

        this.postLogicDevicesAndRedirect(ids, 'requests-module/request-create', queryParams);
    }
    private setTK(ids: string, iTemplate?: number) {

        const queryParams: any = {};
        if (iTemplate != null) {
            queryParams.template = iTemplate;
        }

        this.postLogicDevicesAndRedirect(ids, 'tariff-calc/create', queryParams, true);
    }
    private setReport(ids: string) {
        this.postLogicDevicesAndRedirect(ids, 'reports/create');
    }
    private setDataCreate(ids: string) {
        this.postLogicDevicesAndRedirect(ids, 'datapresentation/create');
    }
    private setRequestCreate(ids: string) {
        this.postLogicDevicesAndRedirect(ids, 'requests-module/request-create');
    }
    private setCommandCreate(ids: string) {
        // ids = '56017';
        this.postLogicDevicesAndRedirect(ids, 'commands-module/command-create');
    }
    private setTKCreate(ids: string) {
      // ids = '56017';
      this.postLogicDevicesAndRedirect(ids, 'tariff-calc/create', null, true);
    }

    private getDevicesNodesIds(item: IHierarchyNodeView | IHierarchyLogicDeviceView) {
      const key = this.getObjectFieldName(FieldNameKey.Key);
      const id = item[key];

      let ids: string;
      if (this.isNodesTab()) {
          ids = (item as IHierarchyNodeView).LogicDevices.map((ld: IHierarchyLogicDeviceView) => `${(item as IHierarchyNodeView).Id}:${ld.Id}`).join();
      } else {
          ids = `${(item as HierarchyLogicDeviceNodeView).IdNodeView}:${item.Id}`;
      }
      return ids;
    }

    private getDevicesIds(item: IHierarchyNodeView | IHierarchyLogicDeviceView) {
        const key = this.getObjectFieldName(FieldNameKey.Key);
        const id = item[key];

        let ids: string;
        if (this.isNodesTab()) {
            ids = (item as IHierarchyNodeView).LogicDevices.map((ld: IHierarchyLogicDeviceView) => ld.Id).join();
        } else {
            ids = item.Id.toString();
        }
        return ids;
    }

    private getLogicDeviceIds() {
        return this.basketItems
          .map(node => 
            node.LogicDevices
          )
          .reduce((list1, list2) => [...list1, ...list2])
          .sort((x: any, y: any) => x.Position - y.Position)
          .map((ld: any) => ld.Id);          
    }
    private getLogicDeviceNodesIds() {
      return this.basketItems
        .map(node => 
          node.LogicDevices
        )
        .reduce((list1, list2) => [...list1, ...list2])
        .sort((x: any, y: any) => x.Position - y.Position)
        .map((ld: any) => `${ld.IdNodeView}:${ld.Id}`);          
  }
    public setNewAnalyze() {
        const logicDevices = this.getLogicDeviceIds() || [];
        this.setAnalyze(logicDevices.join());
    }
    public setNewReport() {
        const logicDevices = this.getLogicDeviceIds() || [];
        this.setReport(logicDevices.join());
    }
    public setNewDataCreate() {
        const logicDevices = this.getLogicDeviceIds() || [];
        this.setDataCreate(logicDevices.join());
    }
    public setNewRequestCreate() {
        const logicDevices = this.getLogicDeviceIds() || [];
        this.setRequestCreate(logicDevices.join());
    }
    public setNewCommandCreate() {
        const logicDevices = this.getLogicDeviceIds() || [];
        this.setCommandCreate(logicDevices.join());
    }
    public setNewTKCreate() {
        const logicDevices = this.getLogicDeviceNodesIds() || [];
        this.setTKCreate(logicDevices.join());
    }

    // buttons template common
    setNewFromPanelTemplate(typePanel: number) {
        if (typePanel === 1) { // analize
            this.setNewAnalyze();
        } else if (typePanel === 2) { // request
            this.setNewRequestCreate();
        } else if (typePanel === 3) { // TK
          this.setNewTKCreate();
      }
    }
    setNewFromTemplate(typePanel: number, idTemplate: number) {
        if (typePanel === 1) { // analize
            this.setNewAnalyzeWithTemplate(idTemplate);
        } else if (typePanel === 2) { // request
            this.setNewRequestWithTemplate(idTemplate);
        } else if (typePanel === 3) { // TK
          this.setNewTKtWithTemplate(idTemplate);
        }
    }
    deleteFromTemplate(typePanel: number, idTemplate: number) {
        if (typePanel === 1) { // analize
            this.deleteValidationTemplate(idTemplate);
        } else if (typePanel === 2) { // request
            this.deleteDataQueryTemplate(idTemplate);
        } else if (typePanel === 3) { // TK
          this.deleteTKTemplate(idTemplate);
        }
    }
    private setNewAnalyzeWithTemplate(idTemplate: number) {
        const logicDevices = this.getLogicDeviceIds() || [];
        this.setAnalyze(logicDevices.join(), idTemplate);
    }
    private setNewRequestWithTemplate(idTemplate: number) {
        const logicDevices = this.getLogicDeviceIds() || [];
        this.setRequest(logicDevices.join(), idTemplate);
    }
    private setNewTKtWithTemplate(idTemplate: number) {
      const logicDevices = this.getLogicDeviceNodesIds() || [];
      this.setTK(logicDevices.join(), idTemplate);
    }
    private deleteValidationTemplate(id: number) {
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
    private deleteDataQueryTemplate(id: number) {
        this.loadingValidTemplatePanel = true;
        this.dataQueryService
            .deleteQueryTemplate(id)
            .then(() => {
                this.loadDataQueueTemplate()
                    .then(() => this.loadingValidTemplatePanel = false);                
            })
            .catch((error: any) => {
                this.loadingValidTemplatePanel = false;
                this.errorsContentForm.push(error);
            })
    }
    private deleteTKTemplate(id: number) {
      this.loadingValidTemplatePanel = true;
      this.tariffCalculationTemplateService
          .deleteTemplate(id)
          .then(() => {
              this.loadTariffCalculationTemplate()
                  .then(() => this.loadingValidTemplatePanel = false);                
          })
          .catch((error: any) => {
              this.loadingValidTemplatePanel = false;
              this.errorsContentForm.push(error);
          })
    }

    /**
     * РАБОТА С КОРЗИНОЙ ==============================
     */
    public toObjectsPanel() {
        const basketItems = this.treeListCheckedService.getDataChecked<IHierarchyNodeView>();

        this.basketItems = this.basketItems || [];
        let posNext = 0;
        const logicDevices = this.basketItems
          .filter(node => node.LogicDevices && node.LogicDevices.length)
          .map(node => 
            node.LogicDevices || []
          );
        if (logicDevices.length) {
          const positions = logicDevices
            .reduce((list1, list2) => [...list1, ...list2])
            .map(ld => ld['Position'] as number);
          posNext = positions.length ? Math.max(...positions) : 0;
        }        
        basketItems
          .forEach(node => 
            node.LogicDevices.forEach(ld => ld['Position'] = ++posNext)
          );
        const template = this.getDataSourceClone(this.basketItems);
        this.utilsTree.includeTree(basketItems, template, 'Id', childDataName);
        this.basketItems = template;
        this.changeDetection = (new Date()).getTime().toString();

        this.loadTabData(true);
        this.accessBasketInit();
    }

    public clearAllBasket() {
        this.basketItems = [];

        this.loadTabData(true);
    }

    public removeListItems(itemsBasket: IHierarchyNodeView[]) {   
        if (itemsBasket.length) {
          this.basketItems = this.basketItems || [];
          const template = this.getDataSourceClone(this.basketItems);
          this.utilsTree.excludeTree(itemsBasket, template, 'Id', childDataName);
          this.basketItems = template;
          this.changeDetection = (new Date()).getTime().toString();
        } else {
          this.basketItems = [];
        }

        this.loadTabData(true);
        this.accessBasketInit();
    }
    /**
     * РАБОТА С КОРЗИНОЙ ========= КОНЕЦ ===============
     */

    private navSelectFromLocal() {
        const nav = localStorage.getItem(currentNavKey);
        if (nav) {
            this.navigate.selectItem = this.menuTabHeader.find(x => x.code === nav);
            this.checkIsMap(nav);
         }
         this.setDetailRowComponents();
    }
    private checkIsMap(nav: string) {
        this.isMap = nav === 'maps' ? true : false;
    }
    private saveCurrentNav(nav: NavigateItem) {
        localStorage.setItem(currentNavKey, nav.code);
    }
}
