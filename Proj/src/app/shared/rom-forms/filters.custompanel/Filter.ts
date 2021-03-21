import { AppLocalization } from 'src/app/common/LocaleRes';
import { TemplateRef } from '@angular/core';
import * as DateRangeModule from '../../../common/models/Filter/DateRange';
import DateRange = DateRangeModule.Common.Models.Filter.DateRange;

import * as LookupModule from '../../../common/models/Filter/Lookup';
import Lookup = LookupModule.Common.Models.Filter.Lookup;

import LookupField = LookupModule.Common.Models.Filter.LookupField;

import * as InputEditorModule from '../../../common/models/Filter/InputEditor';
import InputEditor = InputEditorModule.Common.Models.Filter.InputEditor;
import TypeEditor = InputEditorModule.Common.Models.Filter.TypeEditor;
import { Utils } from '../../../core';

import { IDataService } from "../../../services/common/Data.service";
import { FilterListType } from './Components/new.filter/new.filter';

export interface IFilterValue {
    IsCheck?: boolean;
    Value?: any;
}

export class FilterStringValue implements IFilterValue {
    constructor(public IsCheck?: boolean, public Value?: string) { }
}
export class FilterObjectValue implements IFilterValue {
    constructor(public IsCheck?: boolean, public Value?: any) { }
}
export class FilterDateRangeValue implements IFilterValue {
    constructor(public IsCheck?: boolean, public Value?: DateRange) { }
}
export class FilterSearch {
    constructor(public IsSearch: boolean, public SearchText?: string) { }
}

export class FiltersContainer {

    Filters: Filter[];
    LazyLoad: boolean = false;

    constructor(dataService?: IDataService<any>) {
        FilterDataSource.dataService = dataService;
    }

    addFilter(items: any[]): void {
        this.Filters = [];
        for (let item in items) {
            this.Filters.push(this.createItemFilter(items[item]));
        }        
    }
    addNewFilter(filter: Filter) {

        if (!filter.IsDefault) filter.IsNew = true;
        this.deleteFilter(filter);

        this.Filters.push(this.createItemFilter(filter));
    }
    private removeFromFilterContainer(filter: Filter) {
        if (filter) {
            let i = this.Filters.indexOf(filter);
            if (i >= 0) {
                this.Filters.splice(i, 1);
            }
        }
    }
    deleteFilter(filter: Filter) {
        let filterFind = this.Filters.find(x => x.Name === filter.Name);
        this.removeFromFilterContainer(filterFind);
    }
    clearFilter(filter: Filter) {
        let filterFind = this.Filters.find(x => x.Name === filter.Name);
        if (filterFind) {
            if (!filterFind.IsDefault) {
                this.removeFromFilterContainer(filterFind);
            }
            else if (filterFind.FilterType === 'Array') {
                (<any[]>filterFind.Data || []).forEach((item: FilterObjectValue) => item.IsCheck = false);
            }
            else if (filterFind.FilterType === 'DateTime') {
                filterFind.restoreData();
            }
            else if (filterFind.FilterType === 'Tree') {
                filterFind.Value = [];
            }
            else
                filterFind.Value = null;
        }
    }
    checkFilter(filter: Filter) {
        this.setCheckFilter(filter, true);
    }

    unCheckFilter(filter: Filter) {
        this.setCheckFilter(filter, false);
    }
    //получает инфу, что новый фильтр - filter.IsNew, есть в контейнере
    isNewFilterContains() {
        let filter = (this.Filters || []).find(x => x.IsNew);
        return filter != null;
    }

    private createItemFilter(_filter: any): Filter {

        let filter = new Filter();

        filter.Caption = _filter.Caption;
        filter.IdCategory = _filter.IdCategory;
        filter.Name = _filter.Name;
        filter.FilterType = _filter.FilterType;
        filter.SupportedOperationTypes = _filter.SupportedOperationTypes;
        filter.SelectedOperationType = _filter.SelectedOperationType;
        filter.SelectedOperation = _filter.SelectedOperation || filter.SelectedOperation;
        filter.Value = _filter.Value;

        filter.IsValuesSingle = _filter.IsValuesSingle;
        if (_filter.IsDefault !== undefined) {
            filter.IsDefault = _filter.IsDefault;
        }
        if (_filter.IsNew !== undefined) {
            filter.IsNew = _filter.IsNew;
        }

        
        if (_filter.FilterType === 'String') {
            filter.DataSource = new InputEditor(TypeEditor.Text, _filter.Value);
        } else if (_filter.FilterType === 'Bool') {
            filter.DataSource = new InputEditor(TypeEditor.Bool, _filter.Value == null ? false : _filter.Value);
        } else if (_filter.FilterType === 'Long' || _filter.FilterType === 'Float' || _filter.FilterType === 'Double') {
            let type = _filter.FilterType === 'Long' ? TypeEditor.Number : TypeEditor.Float;
            filter.DataSource = new InputEditor(type, _filter.Value);
        } else if (_filter.FilterType === 'DateTime') {
            if (_filter.Value && _filter.Value instanceof DateRange)
                filter.DataSource = _filter.Value;
            else if (_filter.Value && typeof _filter.Value === "string")
                filter.DataSource = new DateRange(new Date(_filter.Value));
            else
                filter.DataSource = new DateRange();
        } else if (_filter.FilterType === 'Array') {
            filter.DataSource = new Lookup(_filter.Value || filter.Url/*создаем из статики или запрос к сервису*/, new LookupField("Name", "Id"));
        } else if (_filter.FilterType === 'Tree') {
            let treeLookup = new Lookup(filter.Url, new LookupField("Name", "Id"));
            treeLookup.TreeOptions = {};//new TreeOptions.TreeOptions();
            //treeLookup.TreeOptions.idField = "UniqueId";
            //treeLookup.TreeOptions.displayField = "Name";
            //treeLookup.TreeOptions.childrenField = "Children";
            filter.DataSource = treeLookup;
        } else if (_filter.FilterType === 'Custom') {
            filter.DataSource = _filter.Template;
        }

        if (_filter.FilterType === 'Tree' ||
            _filter.FilterType === 'Array') {

            if (!this.LazyLoad) {
                filter.initDataSource();       
            }

            filter.Search.IsSearch = _filter.FilterType === 'Array';
        }
        else {
            filter.initDataSource();
        }

        return filter;
    }    

    getCheckFilters(): any {
        let filters = {};
        for (let f in this.Filters) {
            let filter = this.Filters[f];
            if (filter.Data) {
                if (filter.Data instanceof Array) {
                    filters[filter.Name] = { Value: [], SelectedOperation: filter.SelectedOperation };

                    if (filter.FilterType === 'Tree') {
                        filters[filter.Name].Value = filter.getValues();
                    } else if (filter.FilterType === 'Array') {
                        for (let val in filter.Data) {
                            if (filter.Data[val].IsCheck) {
                                filters[filter.Name].Value.push(filter.Data[val].Value);
                            }
                        }
                    }

                    if (!(filters[filter.Name].Value || []).length) delete filters[filter.Name];
                } else {
                    if (filter.Data.Value != null) {
                        if (filter.Data.Value instanceof DateRange) {
                            let dateRange = <DateRange>filter.Data.Value;
                            if (dateRange.FromDate || dateRange.ToDate) {
                                filters[filter.Name] = { Value: dateRange, SelectedOperation: filter.SelectedOperation };
                            }
                        } else {
                            filters[filter.Name] = { Value: filter.Data.Value, SelectedOperation: filter.SelectedOperation };
                        }
                    }
                }
            }
        }
        return filters;
    }

    private setCheckFilter(filter: Filter, isCheck: boolean) {
        filter.IsCheck = isCheck;
        if (filter.Data) {
            if (filter.Data.Value instanceof DateRange) {
                filter.Data.Value.FromDate = filter.Data.Value.ToDate = null;
            }
            else if (filter.Data instanceof FilterStringValue) {
                filter.Data.Value = null;
            }
        }
    }
}

export interface IFilter {
    //Models
    IdCategory: number;
    Name: string;
    Url: string;//используется для получения списка array из сервиса, состоит из Name[/IdCategory], если IdCategory есть
    FilterType: string;
    SupportedOperationTypes: any[];
    SelectedOperationType: any;
    SelectedOperation: any;

    //свойства фильтра
    IsValuesSingle: boolean;//выбор записей checkbox или radiobutton, default = false/checkbox
    IsCheck: boolean;
    IsDefault: boolean;
    IsNew: boolean;//указывает, что фильтр новый, добавляется через updateFilters - "избранное" или из окна "новый фильтр"

    //для работы с данными
    Lookup: Lookup; //нужен для работы с Value == "object"

    //интерфейсные настройки
    Caption: string;
    Search: FilterSearch; //нужен для поиска записи внутри фильтра

    DataSource: any;//источник данных
    Data: any;//значения
    DefaultData: any;//сохраненные значения при начальной установки, нужен для сброса в default
    Value: any;//предустановленные
}

enum EditorFilterType { Text, Number, Date, Float, Custom, Bool }

export class Filter implements IFilter {

    IdCategory: number;
    Name: string;
    get Url() {
        let url = this.Name;
        if (this.IdCategory != null) url = `${url}/${this.IdCategory}`;
        return url;
    }
    FilterType: string;
    SupportedOperationTypes: any[];
    SelectedOperationType: any;
    SelectedOperation: any = { Code: 'Contains', Name: AppLocalization.Contains };

    IsValuesSingle: boolean;
    private _isCheck: boolean = false;
    get IsCheck() {
        if (this.Data) {
            if (this.Data instanceof Array) {
                for (let i = 0; i < this.Data.length; i++) {
                    this._isCheck = this._isCheck || this.Data[i].IsCheck;
                }
            }
        }

        return this._isCheck;
    }
    set IsCheck(val: boolean) {
        if (this.Data) {
            if (this.Data instanceof Array) {
                for (let i = 0; i < this.Data.length; i++) {
                    this.Data[i].IsCheck = val;
                }
            }
        }
        this._isCheck = val;
    }
    IsDefault: boolean = false;
    IsNew: boolean = false;

    Lookup: Lookup;
    EditorType: EditorFilterType/* = EditorFilterType.Text*/;

    Caption: string;
    Search: FilterSearch;

    DataSource: any;
    Data: any;
    DefaultData: any;
    Value: any;

    constructor() {
        if (!this.Search) {
            this.Search = new FilterSearch(false);
        }
    }

    initDataSource(callback?: any): void {

        //TODO ??? хз, нужен ли Lookup.Common.Lookup в Filter
        //if (dataSource instanceof Lookup) {
        //    let lookup = <Lookup>dataSource;
        //    this.Lookup = new Lookup(lookup.DisplayField, lookup.ValueField);
        //    dataSource = lookup.DataSource;
        //}

        if (this.DataSource instanceof Lookup) {
            this.Lookup = <Lookup>this.DataSource;

            FilterDataSource.getValues(this.Lookup.DataSource).then((items: IFilterValue[]) => {

                if (this.Lookup.TreeOptions) {
                    this.Data = items;
                } else {
                    let result: any[] = [];
                    //массив предустановленных значений
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i];

                        //предустановка выделения, если ранее были выбраны строки
                        //если IsNew = true, фильтр новый, проствляем IsCheck
                        let isCheck = false;
                        if (this.IsNew && this.Lookup.DataSource instanceof Array) isCheck = true;

                        if (typeof item === "string") {
                            result.push(new FilterStringValue(isCheck, item));
                        } else if (typeof item === "object") {
                            result.push(new FilterObjectValue(isCheck, item));
                        }
                    }

                    this.Data = result;

                    if (this.IsValuesSingle) {
                        if (this.Data && this.Data.length) this.Data[0].IsCheck = true;
                    }

                    if (callback) callback();
                }

            }, (error: any) => { });
        }
        else if (this.DataSource instanceof DateRange) {
            this.EditorType = EditorFilterType.Date;
            this.Data = new FilterDateRangeValue(true, this.DataSource);

            this.saveData();
        }
        //Date or DateInterval
        else if (this.DataSource instanceof InputEditor) {
            if ((<InputEditor>this.DataSource).getType() === TypeEditor.Number)
                this.EditorType = EditorFilterType.Number;
            else if ((<InputEditor>this.DataSource).getType() === TypeEditor.Float)
                this.EditorType = EditorFilterType.Float;
            else if ((<InputEditor>this.DataSource).getType() === TypeEditor.Bool)
                this.EditorType = EditorFilterType.Bool;
            else
                this.EditorType = EditorFilterType.Text;

            this.Data = new FilterStringValue(true, (<InputEditor>this.DataSource).Value);
        }
        else if (this.DataSource instanceof TemplateRef) {
            this.EditorType = EditorFilterType.Custom;
            this.Data = this.DataSource;
        }
        
        this.clearDataSource();
    }

    getValues() {
        let result: any = this.Value;
        if (this.Lookup) {
            if (this.FilterType === "Tree") {
                result = result || [];
                /*if (this.hasOwnProperty('TreeModele')) {
                    let treeModele = this['TreeModele'];
                    if (treeModele && treeModele.treeView) {
                        result = [];
                        let valObjects = treeModele.treeView.getSelectedNodes();
                        if (valObjects) {
                            let keys = Object.keys(valObjects);
                            let values: any[] = [];
                            for (let i = 0; i < keys.length; i++) {
                                values.push(valObjects[keys[i]]);
                            }
                            result = values;
                        }
                    }
                }*/
            }
            else if (this.FilterType === "Array") {
                result = [];
                if (this.Data) {
                    if (this.Data instanceof Array) {                        
                        let selectItems = this.Data.filter((item: any) => item.IsCheck);
                        if (selectItems && selectItems.length) {                            
                            selectItems.forEach((item: any) => result.push(item.Value));
                        }
                    }
                }
            }
        } else if (typeof (this.EditorType) !== 'undefined') {
            result = null;
            if (this.Data) {
                if (this.Data.Value != null) {
                    if (this.EditorType === EditorFilterType.Date) {
                        if (this.Data.Value instanceof DateRange) {
                            let dataValue: DateRange = <DateRange>this.Data.Value;

                            let isIntervalMode: boolean = dataValue.IsIntervalMode;
                            let fromDate: any = dataValue.FromDate;
                            let toDate: any = dataValue.ToDate;

                            if ( ( !isIntervalMode && fromDate == null ) || ( isIntervalMode && fromDate == null && toDate == null ) ) {
                                result = null;
                            } else {
                                result = dataValue;
                            }
                        }
                    } else if (this.EditorType === EditorFilterType.Number) {
                        result = parseInt("" + this.Data.Value);
                    } else if (this.EditorType === EditorFilterType.Float) {
                        result = parseFloat("" + this.Data.Value);
                    } else if (this.EditorType === EditorFilterType.Bool) {
                        result = this.Data.Value;
                    } else {
                        result = this.Data.Value;
                    }
                }
            }
        }

        return result;
    }

    getTextValues() {

        if (this.FilterType === "Array" || this.FilterType === "Tree") {
            let field = this.Lookup.LookupField.DisplayField;
            let result = "";
            let values = this.getValues();
            (values || []).forEach((val: any, index: number) => result += (val[field] + (index < (values.length - 1) ? ", " : "")));
            return result;
        }
        else if (this.FilterType === 'DateTime') {
            let fromDateTime: Date;
            let toDateTime: Date;
            if (this.Value && this.Value instanceof DateRange) {
                fromDateTime = this.Value.FromDate;
                toDateTime = this.Value.ToDate;
                if (this.Value.IsIntervalMode) toDateTime = this.Value.ToDate;
            }
            else if (this.Value && typeof this.Value === "string") {
                fromDateTime = new DateRange(new Date(this.Value)).FromDate;
            }

            // return fromDateTime ? (new DateFormat.Common.DateFormat()).getDateTime(fromDateTime) : "";
            // return this.Value.IsIntervalMode ? '<span class="font-weight-bold">C </span>' + (new DateFormat.Common.DateFormat()).getDateTime(fromDateTime) +
            //                                    (toDateTime ? '<span class="font-weight-bold"> ПО </span>' + (new DateFormat.Common.DateFormat()).getDateTime(toDateTime) : '')
            //                                    :
            //                                    '<span class="font-weight-bold">C </span>' + (new DateFormat.Common.DateFormat()).getDateTime(fromDateTime);

            return this.Value.IsIntervalMode
                ?
                (fromDateTime ? '<span class="font-weight-bold">C </span>' + (new Utils.DateFormat()).getDateTime(fromDateTime) : '') +
                (toDateTime ? '<span class="font-weight-bold"> ПО </span>' + (new Utils.DateFormat()).getDateTime(toDateTime) : '')
                :
                (new Utils.DateFormat()).getDateTime(fromDateTime);
        } else if (this.FilterType === 'Bool') {
            return this.getValues() ? AppLocalization.Yes : AppLocalization.No;
        } else {
            return this.getValues();
        }
    }

    private saveData() {
        this.DefaultData = JSON.stringify(this.Data);
    }
    restoreData() {
        if (this.FilterType === 'DateTime') {
            this.Data = Object.assign(new DateRange(), JSON.parse(this.DefaultData));
        }
    }
    private clearDataSource() {
        delete this.DataSource;
    }
}

class FilterDataSource {

    static dataService: IDataService<any>;

    static getValues(dataSource: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.initDataSource(dataSource));
            } catch (e) {
                reject(e);
            }
        });
    }

    private static initDataSource(dataSource: any): Promise<IFilterValue[]> {
        return new Promise((resolve, reject) => {

            if (dataSource) {

                //string - получение из сервиса данных
                if (typeof dataSource === "string") {

                    if (this.dataService) {
                        this.dataService
                            .get(dataSource)
                            .subscribe(
                            (data: any) => {
                                resolve(data);
                            }
                            );
                    }
                }
                else {
                    resolve(dataSource);
                }

            } else {
                resolve([]);
            }
        });
    }
}