import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, AfterViewChecked, AfterContentChecked, Input, Output, EventEmitter } from '@angular/core';

import * as FilterModels from '../../Filter';

import { Common } from '../../../../../common/models/Filter/DateRange';

//import * as LookupModule from '../../../../../common/models/Filter/Lookup';
//import Lookup = LookupModule.Common.Models.Filter.Lookup;
//import LookupField = LookupModule.Common.Models.Filter.LookupField;

import { IFilterContainer } from '../../../../../services/common/Models/Filters/IFilterContainer';
import { FiltersService } from "../../../../../services/common/Filters.service";

import * as RU from "../../../../../common/Constants";
import Constants = RU.Common.Constants;
import DateRange = Common.Models.Filter.DateRange;

declare var $: any;

enum FilterCategories { PackName, GroupName, FilterName }
export enum FilterListType { Tree, List } //тип фильтра, обычный список - List, или разбит на группы и категории - Tree

@Component({
    selector: 'new-filter',
    templateUrl: 'new.filter.html',
    styleUrls: ['new.filter.css']
})

export class NewFilterComponent implements OnInit, AfterContentChecked {

    public constants = Constants;
    private _panelIndex: number;
    @Input()
    get panelIndex() {
        return this._panelIndex;
    }
    set panelIndex(panelIndex: number) {
        this._panelIndex = panelIndex;

        if (panelIndex === 2) {
            setTimeout(() => $('#new-filter').css('width', '100%'), 200);
        } else if (panelIndex === 3) {
            setTimeout(() => $('#filter-values').css('width', '100%'), 200);
        }
    }
    @Input() curr_filter: any = {};
    @Input() service: IFilterContainer;    

    @Output() panelIndexChange = new EventEmitter<number>();
    @Output() onAddFilter = new EventEmitter<any>();

    operators: any[] = [];
    loadingFilterPanel: boolean = false;
    errors: any[] = [];
    isAddFilter: boolean;
    FilterListType = FilterListType;
    public filterListType: FilterListType = FilterListType.Tree;

        
    public FilterCategories = FilterCategories;
    FiltersContainer: FilterModels.FiltersContainer; //FilterListType.List
    FilterContainersContainer: any = {};//FilterListType.Tree
    filterByPackName: boolean = true;
    filterByGroupName: boolean = false;
    filterByFilterName: boolean = false;
    filterSearchTextByPackName: string = '';
    filterSearchTextByGroupName: string = '';
    filterSearchTextByFilterName: string = '';
    filterSearchName: string[] = [AppLocalization.Category, AppLocalization.Group, AppLocalization.Filter];


    constructor(public filterCommon: FiltersService) { }

    ngOnInit() {

        if (this.panelIndex === 2) {
            this.loadData();
        }
        else if (this.panelIndex === 3) {
            //эта ветка, только переход из главного окна,
            //panelIndex = 1
            this.loadOperationsType();

            let data: any = {
                IdCategory: this.curr_filter.IdCategory,
                Code: this.curr_filter.Name,
                FilterType: this.curr_filter.FilterType,
                Name: this.curr_filter.Caption,
                SupportedOperationTypes: this.curr_filter.SupportedOperationTypes,
                SelectedOperationType: this.curr_filter.SelectedOperationType,                
            };
            if (this.curr_filter.FilterType === 'Array') {
                //data.Value = this.curr_filter.Value;
            }
            else if (this.curr_filter.FilterType === 'DateTime') {
                data.Value = Object.assign(new Common.Models.Filter.DateRange(), this.curr_filter.Value);
            }
            else {
                if (this.curr_filter.Value instanceof Object) {
                    //data.Value = this.curr_filter.Value;
                }
                else {
                    data.Value = this.curr_filter.Value;
                }
            }
            this.FiltersContainer = this.initDefFilters([data]);

            if (this.FiltersContainer.Filters && this.FiltersContainer.Filters[0]) {
                let filter = this.FiltersContainer.Filters[0];

                let callback: any = null;
                if (this.curr_filter.FilterType === 'Array') {
                    let values: any[] = this.curr_filter.Value;
                    callback = () => {
                        (this.curr_filter.Data || [])
                            .filter((f: FilterModels.FilterObjectValue) => {
                                return (values || []).find((x: any) => x.Id === f.Value.Id) != null
                            })
                            .forEach((f: FilterModels.FilterObjectValue) => f.IsCheck = true);
                    }
                }

                this.curr_filter = filter;
                this.curr_filter.initDataSource(callback);
            }
        }
    }

    ngAfterContentChecked() {

        this.detectChangeValues();
    }

    private detectChangeValues() {

        if (this.panelIndex === 3) {

            let filterValue = this.curr_filter.getValues();
            this.isAddFilter = (filterValue != null &&
                ((typeof filterValue === "string" && filterValue != "") ||
                    typeof filterValue === "number" ||
                    typeof filterValue === "boolean" ||
                    (filterValue instanceof Object && Object.keys(filterValue).length > 0) ||
                    (filterValue instanceof Array && filterValue.length > 0) ||
                     filterValue instanceof DateRange ||
                    //все остальные случаи
                    false

                ));
        }
    }

    private loadData() {
        this.loadingFilterPanel = true;

        this.service.filtersNewService
            .get()
            .subscribe(
            (data: any[]) => {

                if (data.length && !data[0].FilterGroups) this.filterListType = this.FilterListType.List;//если нет этого проперти, значит простой список

                if (this.filterListType === this.FilterListType.Tree) {
                    for (let i = 0; i < data.length; i++) {
                        this.FilterContainersContainer[i] = {};
                        this.FilterContainersContainer[i]['CategoryName'] = data[i].Name;
                        this.FilterContainersContainer[i]['Groups'] = {};
                        for (let j = 0; j < data[i].FilterGroups.length; j++) {
                            this.FilterContainersContainer[i]['Groups'][j] = {};
                            this.FilterContainersContainer[i]['Groups'][j]['GroupName'] = data[i].FilterGroups[j]['Name'];
                            this.FilterContainersContainer[i]['Groups'][j]['FiltersContainer'] = this.initDefFilters(data[i].FilterGroups[j].Filters);
                        }
                    }
                }
                else if (this.filterListType === this.FilterListType.List) {
                    this.FiltersContainer = this.initDefFilters(data || []);
                }

                this.loadOperationsType();
            },
            (error) => {
                this.loadingFilterPanel = false;
                this.errors.push(error);
            }
        );
    }

    private loadOperationsType() {
        this.loadingFilterPanel = true;
        this.filterCommon
            .getOperators()
            .subscribe(
            (data: any[]) => {
                this.operators = data;
                this.loadingFilterPanel = false;
            },
            (error) => {
                this.loadingFilterPanel = false;
                this.errors.push(error);
            }
            );
    }

    private initDefFilters(filters: any[]) {
        let allFilterItems: any[] = [];
        filters.forEach((elem: any) => {
            let filterProps: any = {};
            filterProps = Object.assign(filterProps, elem);
            filterProps.Caption = elem.Name;
            filterProps.IdCategory = elem.IdCategory;
            filterProps.Name = `${elem.Code}`;

            allFilterItems.push(filterProps);            
        });
        return this.addFilter(allFilterItems);
    }

    private addFilter(items: any[]): FilterModels.FiltersContainer {
        let filtersContainer = new FilterModels.FiltersContainer(this.service.filtersNewService);
        filtersContainer.LazyLoad = true;
        filtersContainer.addFilter(items);
        return filtersContainer;
    }

    public getOperator(o: string): string {
        return (this.operators.find(x => x.Code === o) || { Description: '' }).Description;
    }

    public filterBy(name: FilterCategories) {
        if (name == FilterCategories.PackName) {
            this.filterByPackName = true;
            this.filterByGroupName = false;
            this.filterByFilterName = false;
        } else if (name == FilterCategories.GroupName) {
            this.filterByPackName = false;
            this.filterByGroupName = true;
            this.filterByFilterName = false;
        } else {
            this.filterByPackName = false;
            this.filterByGroupName = false;
            this.filterByFilterName = true;
        }
    }
    onSearchInput(event: string) {
        if (this.filterByPackName) {
            this.filterSearchTextByPackName = event;
            this.filterSearchTextByGroupName = '';
            this.filterSearchTextByFilterName = '';
        } else if (this.filterByGroupName) {
            this.filterSearchTextByPackName = '';
            this.filterSearchTextByGroupName = event;
            this.filterSearchTextByFilterName = '';
        } else {
            this.filterSearchTextByPackName = '';
            this.filterSearchTextByGroupName = '';
            this.filterSearchTextByFilterName = event;
        }
    }


    showFilterValues(filter: any) {

        this.panelIndex = 3; //filter values
        setTimeout(() => { this.formItemShow('.section-body-content'); }, 100);

        /*if (typeof filter.Data == 'undefined') { // этот фильтр надо кэшировать ... - кэшируем
            this.allFiltersService
                .get('tags')
                .subscribe(
                    (data: any[]) => {
                        filter.initDataSource(new Lookup(data, new LookupField("Name", "Id")));
                        this.curr_filter = filter;
                    });
        } else {
            this.curr_filter = filter;
        }*/
        // Todo это костыль ROM-904, ROM-943 - для главного окна уметь задавать настройку из вне
        if (/*filter.Name === 'LastModified' && */
            filter.Data != null && filter.Data.Value != null && filter.Data.Value instanceof DateRange) {
            filter.Data.Value.IsIntervalMode = false;
        }

        this.curr_filter = filter;
        this.curr_filter.initDataSource();

        this.panelIndexChange.emit(this.panelIndex);
    }
    
    actionButtonBlur(p: any, operator: any) {
        this.curr_filter.SelectedOperationType = operator;
        setTimeout(() => { p.close(); }, 200);
    }
    
    createFilter() {

        let exts = {
            SelectedOperation: { Code: this.curr_filter.SelectedOperationType, Name: this.getOperator(this.curr_filter.SelectedOperationType) },
            Value: this.curr_filter.getValues()
        }

        this.onAddFilter.emit(Object.assign(this.curr_filter, exts));
    }

    private formItemShow(item: any, callback?: any) {
        //$(item).show('slide', 500, callback); //.toggle('slide', { direction: 'down' }, 500);
    }

    private formItemHide(item: any, callback?: any) {
        //$(item).hide('slide', 500, callback);
    }

    public hideContainer(parentNode: any) {        
        return $(parentNode).find("#filterGroupDiv").length === 0 ||
            $(parentNode).find("#filterContainerDiv").length === 0;
    }
}