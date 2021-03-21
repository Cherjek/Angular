import { Component, OnInit, AfterViewInit, AfterContentChecked, Input, Output, TemplateRef, EventEmitter, HostListener } from '@angular/core';
import * as FilterModels from './Filter';

import { IFilterContainer } from '../../../services/common/Models/Filters/IFilterContainer';
import { FilterValue } from '../../../common/models/Filter/FilterValue';
import { IFilter } from './Filter';
import { FiltersService } from "../../../services/common/Filters.service";

import * as RU from "../../../common/Constants";
import Constants = RU.Common.Constants;

declare var $: any;

@Component({
    selector: 'frame-filters-custompanel',
    templateUrl: 'filters.custompanel.html',
    styleUrls: ['filters.custompanel.css']
})

export class FiltersCustomPanelComponent implements OnInit, AfterViewInit, AfterContentChecked {

    constructor(public filterCommon: FiltersService) { }

    public panelIndex = 1;
    public loadingFilterPanel = true;
    public errorsFiltersForm: any[] = [];
    public filterTemplateName: string;
    public constants = Constants;

    public changableNewFilter: any;

    public isFilterPanelShow = true;
    
    FiltersContainer: FilterModels.FiltersContainer;

    private defualtFilter: string;
    private appliedFilter: string;
    public isNewFilterItemAdd = false;
    public isFilterDefChange = false;//изменился дефолтный фильтр, для сброса
    public isFilterChange = false;//изменился фильтр вообще, для кнопки применить
    @Input() isUseFavorite = false;
    @Input() isAsyncCallbackStart = false;
    @Input() service: IFilterContainer;
    @Input() filtersCustomDefault: IFilter[];
    @Output() onApplyFilter = new EventEmitter<any>();    

    ngOnInit() {

        if (!this.service) throw "не задан параметр service";
        this.FiltersContainer = new FilterModels.FiltersContainer(this.service.filtersNewService);

        if (this.service.filtersService) {
            this.service.filtersService
                .getDefault()
                .subscribe(
                (data: any[]) => {
                    this.loadingFilterPanel = false;
                    (data || []).forEach((x: any) => x.IsDefault = true);
                    this.initFilters(data || [], true);
                    if (!(data || []).length) {
                        this.isFilterPanelShow = false;
                    }
                },
                (error: any) => {
                    this.loadingFilterPanel = false;
                    this.errorsFiltersForm.push(error);
                });
        }
    }

    ngAfterViewInit() { }

    ngAfterContentChecked() {
        this.detectChangeValues();
    }

    @HostListener('document:keydown', ['$event']) onKeyDownFilter(event: KeyboardEvent) {        
        event.stopPropagation();    }

    @HostListener('document:keyup', ['$event']) onKeyUpFilter(event: KeyboardEvent) {        
        event.stopPropagation();
    }
    @HostListener('document:mouseup', ['$event']) onMouseUpFilter(event: KeyboardEvent) {
        event.stopPropagation();
    }

    private timeoutChangeDetect: any;
    private detectChangeValues() {

        //clearTimeout(this.timeoutChangeDetect);

        let filters = this.getFilters();

        let jsonFilters = JSON.stringify(filters);
        if (!this.defualtFilter) this.defualtFilter = jsonFilters;
        if (!this.appliedFilter) this.appliedFilter = jsonFilters;

        let updateState = () => {
            this.isFilterChange = /*(Object.keys(filters).length > 0 &&*/ this.appliedFilter !== jsonFilters;
            this.isFilterDefChange = (Object.keys(filters).length > 0 && this.defualtFilter !== jsonFilters);
            this.isNewFilterItemAdd = this.FiltersContainer.isNewFilterContains();
        }

        if (this.appliedFilter === jsonFilters) {
            clearTimeout(this.timeoutChangeDetect);
            updateState();
        } else {
            this.timeoutChangeDetect = setTimeout(() => { updateState() }, 50);
        }
    }

    private initFilters(filters: any[], isCreate: boolean = false) {
        let allFilterItems: any[] = [];
        filters.forEach((elem: any) => {
            let filterProps: any = {};
            filterProps = Object.assign(filterProps, elem);
            filterProps.Caption = elem.Name;
            filterProps.Name = `${elem.Code}`;
            
            allFilterItems.push(filterProps);
        });
        if (isCreate)
            this.addFilter(allFilterItems);
        else
            this.addNewFilterInContainer(allFilterItems);

        //Фильтры, которые устанавливаются по умолчанию в панель новые фильтры
        if (this.filtersCustomDefault != null) {
            this.addNewFilterInContainer(this.filtersCustomDefault);
        }
    }

    private addFilter(items: any[]): void {
        this.FiltersContainer.addFilter(items);
    }
    private addNewFilterInContainer(items: any[]): void {
        this.isFilterDefChange = this.isNewFilterItemAdd = true;

        items.forEach((item: any) => {
            this.FiltersContainer.addNewFilter(item);    
        });
    }

    public clearAllFilter() {
        for (let i = this.FiltersContainer.Filters.length - 1; i >= 0; i--) {
            this.clearFilter(this.FiltersContainer.Filters[i]);
        }
    }

    private isNotApplyCall: boolean;
    private timerClearFilter: any;
    public clearFilter(filter: any) {
        this.FiltersContainer.clearFilter(filter);

        filter.isClear = true;
        setTimeout(() => delete filter.isClear, 500);

        if (!this.isNotApplyCall) {
            if (this.timerClearFilter) clearTimeout(this.timerClearFilter);
            this.timerClearFilter = setTimeout(() => {
                this.applyFilter();
            }, 100);
        }
    }

    public addNewFilter() {
        this.panelIndex++; //new filter
    }

    public back2InitFilter() {
        this.panelIndex--;
    }

    public back2NewFilter() {
        if (this.changableNewFilter) {
            delete this.changableNewFilter;
            this.panelIndex = 1;
        }
        else {
            this.panelIndex--;
        }
    }

    public onAddFilter(filter: any) {
        this.panelIndex = 1;
        this.addNewFilterInContainer([filter]);
    }

    private getFilters(): any {
        return this.FiltersContainer.getCheckFilters();
    }
    applyFilter() {
        let requestFilters = this.createRequestFilter();
        this.appliedFilter = JSON.stringify(this.getFilters());
        this.isFilterChange = false;
        /*this.isAsyncCallbackStart = */this.loadingFilterPanel = true;
        let promise = this.service.filtersService.upload != null ?
                        this.service.filtersService.upload(requestFilters) : this.filterCommon.upload(requestFilters);
        if (promise) {

            //requestFilters.forEach((f: any) => { if (f["Value"]) f["Value"] = JSON.stringify(f["Value"]) });

            promise
                .then((result: any | any[]) => {
                    //сервис может быть настроен не на вызов удаленного сервиса,
                    //а получение из файла сервиса JSON напрямую, в данном случае,
                    //считаем фильтр полученным и передаем его в форму,
                    //где уже обрабатываем доп-но и передаем в pipe: filterRow
                    if (result instanceof Array) {
                        result.forEach((filter: IFilter) => {
                            if (filter.FilterType === 'Long' || filter.FilterType === 'Float') {
                                filter.Value = new FilterValue(JSON.parse(filter.Value), filter.SelectedOperationType);
                            }
                        });
                    }

                    this.loadingFilterPanel = false;
                    this.onApplyFilter.emit(result);
                }, (error: any) => {
                    this.loadingFilterPanel = false;
                    this.errorsFiltersForm.push(error);
                });
        }
        else {
            this.loadingFilterPanel = false;
            this.onApplyFilter.emit(requestFilters);
        }
    }

    public showSaveTemplate(event: any) {
        $(event.currentTarget).tooltip('dispose');
        this.formItemShow('.panel-save-template');
    }
    private createRequestFilter() {
        let requestFilters: any[] = [];
        this.FiltersContainer.Filters.forEach((filter: any) => {

            let values = filter.getValues();

            if (typeof (values) !== 'undefined' && (values instanceof Array ? values.length : true)) {
                requestFilters.push({
                    "Code": filter.Name,
                    "IdCategory": filter.IdCategory,
                    "FilterType": filter.FilterType,
                    "Name": filter.Caption,
                    "SupportedOperationTypes": filter.SupportedOperationTypes,
                    "SelectedOperationType": filter.SelectedOperationType,
                    "Value": values
                });
            }
        });
        return requestFilters;
    }
    public confirmSaveTemplate() {

        this.loadingFilterPanel = true;
        let requestFilters: any[] = this.createRequestFilter();
        if (requestFilters.length) {
            this.service.filtersTemplateService.create({
                name: this.filterTemplateName,
                filters: requestFilters
            }).then(() => {
                    this.loadingFilterPanel = false;
                },
                (error) => {
                    this.loadingFilterPanel = false;
                    this.errorsFiltersForm.push(error.Message);
                });     
        }

        this.formItemHide('.panel-save-template');
    }
    public cancelSaveTemplate() {
        this.formItemHide('.panel-save-template');
    }

    public go2Favorites(event: any): void {
        $(event.currentTarget).tooltip('dispose');
        this.panelIndex = 4;
    }

    public onFavoriteSelect(favor: any): void {
        this.loadingFilterPanel = true;
        this.service.filtersTemplateService
            .get(favor.Id)
            .subscribe(
                (data: any[]) => {
                    this.loadingFilterPanel = false;

                    this.isNotApplyCall = true;
                    this.clearAllFilter();
                    this.isNotApplyCall = false;

                    this.initFilters(data || []);

                    this.panelIndex = 1;
                },
                (error) => {
                    this.loadingFilterPanel = false;
                    this.errorsFiltersForm.push(error);

                    this.panelIndex = 1;
                });

    }

    private formItemShow(item: any, callback?: any) {
        $(item).slideToggle(500, 'swing', callback); //.toggle('slide', { direction: 'down' }, 500);
    }

    private formItemHide(item: any, callback?: any) {
        $(item).slideToggle(500, 'swing', callback);
    }

    public changeNewFilterValue(filter: any) {
        this.changableNewFilter = filter;
        this.panelIndex = 3;
    }    
}