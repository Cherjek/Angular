import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, ViewChild, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import * as CommonModules from '../../../../common/models/Filter/DateRange';
import DateRange = CommonModules.Common.Models.Filter.DateRange;

import { NavigateItem } from '../../../../common/models/Navigate/NavigateItem';
import { GlobalValues, Utils } from '../../../../core';
import DateConvert = Utils.DateConvert;
import DateFormat = Utils.DateFormat;

import { DataResultSettingsService } from '../../../../services/datapresentation.module/DataResultSettings.service';
import { FilterDataPresentContainerService } from '../../../../services/datapresentation.module/Filters/FilterContainer.service';
import { ObjectTagsValueService } from '../../../../services/datapresentation.module/ObjectTagsValue.service';
import { HierarchyTagsValueService } from '../../../../services/datapresentation.module/HierarchyTagsValue.service';

import { FilterRowPipe } from "../../../../shared/rom-pipes/filter-row.pipe";
import { Subscription } from 'rxjs';

declare var $: any;

const storageNavPanelSave = "DatapresentationResultDataComponent.storageNavPanelSave";
export const storagePageTitle = "DatapresentationResultDataComponent.storagePageTitle";

@Component({
    selector: 'frame-datapresentation-result-data',
    templateUrl: 'datapresentation.result.data.html',
    styleUrls: ['datapresentation.result.data.css']
})

export class DatapresentationResultDataComponent implements OnInit, OnDestroy {

    public menuTabHeader: NavigateItem[] = [];
    public loadingContentPanel: boolean = false;
    public errorsContentForm: any[] = [];    
    public isShowFilter: boolean = false;
    public filterValueTemplateItems = [AppLocalization.Empty, AppLocalization.Exact, AppLocalization.Range];
    public dataBigConfirm: any;
    private dateInfo: string;
    public panelNavVisible = {
        isTable: true,
        isGraph: false,
        isTag: false,
    }
    afterConfirm$: Subscription;
    data$: Subscription;
    private get panelNavVisibleStorage(): any {
        let result;
        const storage = localStorage.getItem(storageNavPanelSave);
        if (storage) {
            result = JSON.parse(storage);
        }
        return result;
    }
    private set panelNavVisibleStorage(val: any) {
        localStorage.setItem(storageNavPanelSave, JSON.stringify(val));
    }
    private get isHierarchy() {
        return this.router.url.startsWith('/hierarchy');
    }
    private get dataService() {
        if (this.isHierarchy) {
            this.hierarchyTagsValueService.idHierarchy = GlobalValues.Instance.hierarchyApp.Id;

            return this.hierarchyTagsValueService;
        } else {
            return this.objectTagsValueService;
        }
    }

    DataSource: any[];
    BigDataSource: any[];
    Filter: FilterRowPipe = new FilterRowPipe();
    FilterTable: any;

    @ViewChild("filterValueTemplateComponent", { static: true }) filterValueTemplateComponent: TemplateRef<any>;

    constructor(
        private router: Router,
        public filterDataPresentContainerService: FilterDataPresentContainerService,
        public objectTagsValueService: ObjectTagsValueService,
        private hierarchyTagsValueService: HierarchyTagsValueService,
        private dataResultSettingsService: DataResultSettingsService) {
    }

    ngOnInit() {

        if (this.panelNavVisibleStorage != null) this.panelNavVisible = this.panelNavVisibleStorage;

        let menus: NavigateItem[] = [];
        menus.push(Object.assign(new NavigateItem(), { name: AppLocalization.Label98, code: 'tables', isActive: this.panelNavVisible.isTable }));
        menus.push(Object.assign(new NavigateItem(), { name: AppLocalization.Graph, code: 'graph', isActive: this.panelNavVisible.isGraph }));
        menus.push(Object.assign(new NavigateItem(), { name: AppLocalization.Tags, code: 'tags', isActive: this.panelNavVisible.isTag }));
        this.menuTabHeader = menus;
        
        this.loadData();
    }

    private loadData() {

        this.loadingContentPanel = true;

        let settings = this.dataResultSettingsService.getSettings();
        let request = {
            tagIds: settings.tags,
            timestampStart: settings.fromDate != null ? DateConvert.Instance.getTimeOffset(settings.fromDate) : 0,
            timestampEnd: settings.toDate != null ? DateConvert.Instance.getTimeOffset(settings.toDate) : 0
        }

        let fromDate = DateFormat.Instance.getDateTime(settings.fromDate);
        let toDate = DateFormat.Instance.getDateTime(settings.toDate);
        this.dateInfo = fromDate != '' ? `С ${fromDate}` : '';
        this.dateInfo += toDate != '' ? ` по ${toDate}` : '';
        if (this.dateInfo.length) this.dateInfo += '.';

        this.data$ = this.dataService
            .get(request)
            .subscribe(
                (data: any | any[]) => {
                    if (!(data instanceof Array)) {
                        this.dataBigConfirm = data;
                        this.loadingContentPanel = false;
                    } else {
                        this.bindingDataSource(data);
                    }
                },
                (error: any) => {
                    this.errorsContentForm.push(error);
                    this.loadingContentPanel = false;
                }
            );
    }

    private bindingDataSource(data: any[]) {
        this.BigDataSource = data;

        this.createNewFiltersValue(data)
            .then((infoObjectsForHeader: string) => {
                this.loadingContentPanel = false;
                this.isShowFilter = true;

                GlobalValues.Instance.Page = { Info: this.dateInfo + infoObjectsForHeader };
                localStorage.setItem(storagePageTitle, this.dateInfo + infoObjectsForHeader);
            });
    }

    ngOnDestroy() {
        GlobalValues.Instance.Page.Info = null;
        localStorage.removeItem(storagePageTitle);

        this.unsubscriber(this.afterConfirm$);
        this.unsubscriber(this.data$);
    }

    unsubscriber(sub: Subscription) {
        if (sub) {
            sub.unsubscribe();
        }
    }

    continueLoadData() {
        this.loadingContentPanel = true;

        this.afterConfirm$ = this.dataService
            .getAfterConfirm()
            .subscribe(
                (data: any | any[]) => {
                    this.dataBigConfirm = null;
                    this.bindingDataSource(data);
                },
                (error: any) => {
                    this.errorsContentForm.push(error);
                    this.loadingContentPanel = false;
                }
            );
    }

    public backToDataCreatePage() {
        GlobalValues.Instance.Page.backwardButton.navigate();
    }

    onNavSelectChanged(navItem: any, menu: any) {

        this.panelNavVisible.isTable = navItem.code === 'tables';
        this.panelNavVisible.isGraph = navItem.code === 'graph';
        this.panelNavVisible.isTag = navItem.code === 'tags';
        this.panelNavVisibleStorage = this.panelNavVisible;
      }

    private createNewFiltersValue(data: any[]): Promise<any> {

        return new Promise((resolve, reject) => {                       

            let unitsLink = {};
            let logicDevicesLink = {};
            let tagsLink = {};
            let tagsIdLink = {};
            let units: any[] = [];
            let logicDevices: any[] = [];
            let tags: any[] = [];
            data.forEach((item: any) => {
                if (!unitsLink[item.IdUnit]) {
                    unitsLink[item.IdUnit] = 1;
                    units.push({ Id: item.IdUnit, Name: item.UnitDisplayText });
                }
                if (!logicDevicesLink[item.IdLogicDevice]) {
                    logicDevicesLink[item.IdLogicDevice] = 1;
                    logicDevices.push({ Id: item.IdLogicDevice, Name: item.LogicDeviceDisplayText });
                }
                if (!tagsIdLink[item.TagId]) {
                    tagsIdLink[item.TagId] = 1;
                }
                if (!tagsLink[item.TagCode]) {
                    tagsLink[item.TagCode] = 1;
                    tags.push({ Code: item.TagCode, Name: item.TagName });
                }
            });

            const entity = this.isHierarchy ? AppLocalization.Nodes : AppLocalization.Objects;
            const infoHeader = ` ${entity}: ${units.length}, ${AppLocalization.Label32}: ${logicDevices.length}, ${AppLocalization.Tags}: ${Object.keys(tagsIdLink).length}.`;

            unitsLink = null;
            logicDevicesLink = null;
            tagsLink = null;
            tagsIdLink = null;

            this.filterDataPresentContainerService.filtersNewService.setStorageArray(0, units);
            this.filterDataPresentContainerService.filtersNewService.setStorageArray(1, logicDevices);

            //настройка фильтра Value, хитрый компонент указания значения фильтра, ROM-290
            //let filterValue = this.filterDataPresentContainerService.filtersNewService.getFilter("Value");
            //filterValue.Template = this.filterValueTemplateComponent;

            this.filterDataPresentContainerService.filtersService.setTagsFilterValues(tags);            

            resolve(infoHeader);
        })
    }

    public onApplyFilter(filters: any[]) {
        let filter = {};
        (filters || []).forEach((f: any) => {
            let val = f.Value;
            if (f.FilterType === "Array") {
                filter[f.Code] = (<Array<any>>val).map(item => item.Id);
            }
            else if (f.FilterType === "DateTime") {
                filter[f.Code] = Object.assign(new DateRange(), val);
            }
            else {
                filter[f.Code] = val;
            }
        });
        this.loadingContentPanel = true;
        setTimeout(() => {
            this.setFilter(filter)
                .then(() => this.loadingContentPanel = false);
        }, 100);        
    }

    private setFilter(filter: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.FilterTable = filter; // this.Filter.transform(this.BigDataSource, '', filter);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }    

    public onFilterValueTemplateRowClick(filter: any, index: number) {

        //filter.Value = filter.Value || { Type }
    }

    public removeItems(items: any[]) {
        this.BigDataSource =
            this.BigDataSource.filter((item: any) => {
                return items.find((deleteItem: any) => deleteItem.UniqueId === item.UniqueId) == null;
            });
    }
}