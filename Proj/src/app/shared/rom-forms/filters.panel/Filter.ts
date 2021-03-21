import * as DateRangeModule from '../../../common/models/Filter/DateRange';
import DateRange = DateRangeModule.Common.Models.Filter.DateRange;
import * as LookupModule from '../../../common/models/Filter/Lookup';
import Lookup = LookupModule.Common.Models.Filter.Lookup;
import LookupField = LookupModule.Common.Models.Filter.LookupField;
import * as InputEditorModule from '../../../common/models/Filter/InputEditor';
import InputEditor = InputEditorModule.Common.Models.Filter.InputEditor;
import TypeEditor = InputEditorModule.Common.Models.Filter.TypeEditor;

import { IDataService } from "../../../services/common/Data.service";

export interface IFilterValue {
    IsCheck: boolean;
    Value?: any;
}

export class FilterStringValue implements IFilterValue {
    constructor(public IsCheck: boolean, public Value?: string) { }
}
export class FilterObjectValue implements IFilterValue {
    constructor(public IsCheck: boolean, public Value: any) { }
}
export class FilterDateRangeValue implements IFilterValue {
    constructor(public IsCheck: boolean, public Value: DateRange) { }
}
export class FilterSearch {
    constructor(public IsSearch: boolean, public SearchText?: string) { }
}

export class FiltersContainer {

    Filters: Filter[];

    constructor(dataService: IDataService<any>) {
        FilterDataSource.dataService = dataService;
    }

    createFilters(items: any[]): void {
        this.Filters = [];
        for (let item in items) {
            this.Filters.push(this.createItemFilter(items[item]));
        }
    }

    private createItemFilter(_filter: any): Filter {

        let filter = new Filter();

        filter.Caption = _filter.Caption;
        filter.Name = _filter.Name;
        filter.IsValuesSingle = _filter.IsValuesSingle;
        filter.DataSource = _filter.DataSource;

        if (!_filter.IsSearch) {
            filter.Search.IsSearch = false;
        }

        filter.initDataSource();

        if (_filter.Template) {
            filter.Template = _filter.Template;
        }

        return filter;
    }

    checkFilter(filter: Filter) {
        this.setCheckFilter(filter, true);
    }

    unCheckFilter(filter: Filter) {
        this.setCheckFilter(filter, false);
    }

    getCheckFilters(): any {
        let filters = {};
        for (let f in this.Filters) {
            let filter = this.Filters[f];
            if (filter.Data) {
                filters[filter.Name] = [];
                if (filter.Data instanceof Array) {                    
                    for (let val in filter.Data) {
                        if (filter.Data[val].IsCheck) {
                            filters[filter.Name].push(filter.Data[val].Value);
                        }
                    }
                } else {
                    if (filter.IsCheck) {
                        if (filter.Data.Value) {
                            if (filter.Data.Value instanceof DateRange) {
                                let dateRange = <DateRange>filter.Data.Value;
                                if (dateRange.FromDate || dateRange.ToDate)
                                    filters[filter.Name].push(dateRange);
                            } else {
                                filters[filter.Name].push(filter.Data.Value);
                            }
                        }
                    }
                }
                if (!filters[filter.Name].length) delete filters[filter.Name];
            }
        }
        return filters;
    }

    private setCheckFilter(filter: Filter, isCheck: boolean) {
        filter.IsCheck = isCheck;
        if (filter.Data && !isCheck) {
            if (filter.Data.Value instanceof DateRange) {
                filter.restoreData();
            }
            else if (filter.Data instanceof FilterStringValue) {
                filter.Data.Value = null;
            }
        }
    }
}

interface IFilter {
    //Models
    Name: string;

    //свойства фильтра
    IsValuesSingle: boolean;//выбор записей checkbox или radiobutton, default = false/checkbox
    IsCheck: boolean;

    //для работы с данными
    Lookup: Lookup; //нужен для работы с Value == "object"
    
    //интерфейсные настройки
    Caption: string;
    Template: any; //нужен для задания внутри ячейки фильтра какого-то своего представления
    Search: FilterSearch; //нужен для поиска записи внутри фильтра

    DataSource: any;//источник данных
    Data: any;//данные
    DefaultData: any;//сохраненные значения при начальной установки, нужен для сброса в default
}

enum EditorFilterType { Text, Number, Date }

class Filter implements IFilter {

    Name: string;

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
                if (!this.IsValuesSingle) {
                    for (let i = 0; i < this.Data.length; i++) {
                        this.Data[i].IsCheck = val;
                    }
                }
                else {
                    for (let i = 0; i < this.Data.length; i++) {
                        this.Data[i].IsCheck = i === 0;
                    }
                }
            }
        }
        this._isCheck = val;
    }

    Lookup: Lookup;
    EditorType: EditorFilterType = EditorFilterType.Text;

    Caption: string;
    Template: any;
    Search: FilterSearch;

    DataSource: any;
    Data: any;
    DefaultData: any;

    constructor() {
        if (!this.Search) {
            this.Search = new FilterSearch(true);
        }
    }

    initDataSource(): void {

        //TODO ??? хз, нужен ли Lookup.Common.Lookup в Filter
        //if (dataSource instanceof Lookup) {
        //    let lookup = <Lookup>dataSource;
        //    this.Lookup = new Lookup(lookup.DisplayField, lookup.ValueField);
        //    dataSource = lookup.DataSource;
        //}

        if (this.DataSource instanceof Lookup) {
            this.Lookup = <Lookup>this.DataSource;

            FilterDataSource.getValues(this.Lookup.DataSource).then((values: IFilterValue[]) => {

                if (this.Data == null) this.Data = values;

                if (this.IsValuesSingle) {
                    if (this.Data && this.Data.length) this.Data[0].IsCheck = true;
                }
            }, (error: any) => { });
        }
        else if (this.DataSource instanceof DateRange) {
            this.EditorType = EditorFilterType.Date;
            this.Data = new FilterDateRangeValue(true, new DateRange());
        }
        //Date or DateInterval
        else if (this.DataSource instanceof InputEditor) {
            if ((<InputEditor>this.DataSource).getType() === TypeEditor.Number)
                this.EditorType = EditorFilterType.Number;
            else
                this.EditorType = EditorFilterType.Text;

            this.Data = new FilterStringValue(true);
        }
        this.saveData();
    }

    private saveData() {
        this.DefaultData = JSON.stringify(this.Data);
    }
    restoreData() {
        if (this.DataSource instanceof DateRange) {
            let dateRange = <DateRange>Object.assign(new DateRange(), JSON.parse(this.DefaultData));
            if (dateRange.FromDate) this.Data = new FilterDateRangeValue(true, dateRange);
        }
        else {
            this.Data = JSON.parse(this.DefaultData);
        }
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

            let values: any[] = [];

            if (dataSource) {

                //string - получение из сервиса данных
                if (typeof dataSource === "string") {

                    if (this.dataService) {
                        this.dataService
                            .get(dataSource)
                            .subscribe(
                                (data: any) => {
                                    for (let i = 0; i < data.length; i++) {
                                        values.push(new FilterObjectValue(false, data[i]));
                                    }
                                    resolve(values);
                                }
                            );
                    }
                }
                else {
                    //массив предустановленных значений
                    if (dataSource instanceof Array) {
                        for (let i = 0; i < dataSource.length; i++) {
                            let item = dataSource[i];
                            if (typeof item === "string") {
                                values.push(new FilterStringValue(false, item));
                            } else if (typeof item === "object") {
                                values.push(new FilterObjectValue(false, item));
                            }
                        }
                    } else {
                        values = dataSource;
                    }
                    resolve(values);
                }
                
            } else {
                resolve([]);
            }
        });
    }
}