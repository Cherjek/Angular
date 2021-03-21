import { Component, OnInit, AfterContentChecked, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as FilterModels from './Filter';
import { DictionaryService } from '../../../services/common/Dictionary.service';

@Component({
    selector: 'frame-filters-panel',
    templateUrl: 'filters.panel.html',
    styleUrls: ['filters.panel.css']
})

export class FiltersPanelComponent implements OnInit, AfterContentChecked {

    constructor(
        public router: Router,
        public dictionaryService: DictionaryService) { }

    @Input() isCollapsePanel: boolean = true;
    @Input() isAsyncCallbackStart: boolean = false;
    @Output() onApplyFilter = new EventEmitter<any>();
    @Output() onClearFilter = new EventEmitter<any>();
    @Output() onClearAllFilter = new EventEmitter<any>();

    FiltersContainer: FilterModels.FiltersContainer;
    private selectedRadioGroupItem = {};
    public isFilterPanelShow: boolean = true;
    private isFilterPanelLoad: boolean;
    private defualtFilter: string;
    private appliedFilter: string;
    public isFilterDefChange: boolean = false;
    public isFilterChange: boolean = false;
    private get filtersContainerLocalStorageName() {
        let url = this.router.url;
        if (url.indexOf('?') >= 0) url = url.substring(0, url.indexOf('?'));
        return `${url}.FiltersPanelComponent.FiltersContainer`;
    }

    ngOnInit() {              
    }

    private timeoutChangeDetect: any;
    ngAfterContentChecked() {
        if (this.isFilterPanelLoad) {
            this.detectChangeValues();
        }
    }

    
    private detectChangeValues() {

        //clearTimeout(this.timeoutChangeDetect);
        //this.timeoutChangeDetect = setTimeout(() => {
            let filters = this.getFilters();

            if (filters) {
                let jsonFilters = JSON.stringify(filters);
                if (!this.defualtFilter) this.defualtFilter = jsonFilters;
                //if (!this.appliedFilter) this.appliedFilter = jsonFilters;

                this.isFilterChange = (/*(Object.keys(filters).length > 0 &&*/ (this.appliedFilter != null && this.appliedFilter !== jsonFilters));
                this.isFilterDefChange = (Object.keys(filters).length > 0 && this.defualtFilter !== jsonFilters);
            }
        //}, 300);
    }

    private loadFilterContainerFromstorage(): FilterStorage[] {
        let filterStorage: FilterStorage[];
        let filterContainer = localStorage.getItem(this.filtersContainerLocalStorageName);
        if (filterContainer) {
            filterStorage = <FilterStorage[]>JSON.parse(filterContainer);
        }  
        return filterStorage;
    }

    private createFilterFromStorage() {
        let filterStorage = this.loadFilterContainerFromstorage();
        if (filterStorage) {
            if (this.FiltersContainer.Filters && this.FiltersContainer.Filters.length) {
                filterStorage.forEach((fStorage: FilterStorage) => {
                    let f = this.FiltersContainer.Filters.find((f: any) => f.Name === fStorage.Name);
                    if (f) {
                        f.Data = fStorage.Data;
                    }
                });
            }
        }
    }

    createFilters(items: any[]): void {
        this.FiltersContainer = new FilterModels.FiltersContainer(this.dictionaryService);
        this.FiltersContainer.createFilters(items);

        setTimeout(() => {

            this.detectChangeValues();
            //this.createFilterFromStorage();            
            this.applyFilter(false);

            this.isFilterPanelLoad = true;
        }, 100);        
    }
    
    public clearAllFilter() {
        for (let f in this.FiltersContainer.Filters) {
            let filter = this.FiltersContainer.Filters[f];
            this.clearFilter(filter);
        }
        this.onClearAllFilter.emit();
    }

    private timerClearFilter: any;
    public clearFilter(filter: any) {
        this.FiltersContainer.unCheckFilter(filter);
        this.onClearFilter.emit(filter);

        //хитрая штука для запуска процесса уведомления для спискового фильтра, о том что данный фильтр изменился,
        //при сбросе такого фильтра обновляется кнопка Все
        filter.isClear = true;
        setTimeout(() => delete filter.isClear, 500);

        if (this.timerClearFilter) clearTimeout(this.timerClearFilter);
        this.timerClearFilter = setTimeout(() => {
            this.applyFilter();            
        }, 100);
    }

    private getFilters(): any {
        let filters: any;

        try {
            if (this.FiltersContainer) filters = this.FiltersContainer.getCheckFilters();
        }
        catch (e) {
            console.log(e);
        }

        return filters;
    }
    applyFilter(isSaveToStorage: boolean = true) {
        let filters = this.getFilters(); 
        this.appliedFilter = JSON.stringify(filters);
        this.onApplyFilter.emit(filters);

        if (isSaveToStorage) {            
            if (this.FiltersContainer) {
                let filterStorage: FilterStorage[] = [];
                this.FiltersContainer.Filters.forEach((f: any) => {
                    filterStorage.push(new FilterStorage(f.Name, f.Data));                    
                });
                localStorage.setItem(this.filtersContainerLocalStorageName, JSON.stringify(filterStorage));
            }
        }
    }
}

class FilterStorage {
    constructor(public Name: string,
        public Data: any) { }
}