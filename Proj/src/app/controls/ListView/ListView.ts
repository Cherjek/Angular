import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, Input, Output, ElementRef, TemplateRef, ViewChild, EventEmitter, HostListener, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

declare var $: any;

import { VirtualScrollerComponent } from 'ngx-virtual-scroller';

import { GlobalValues } from '../../core';

@Component({
    selector: 'list-view-ro5',
    templateUrl: 'ListView.html',
    styleUrls: ['ListView.css']
})

export class ListView implements OnInit, OnDestroy, AfterViewInit {

    //====================================
    //PROPERTIES
    //====================================
    @ViewChild(VirtualScrollerComponent, { static: true }) private virtualScroll: VirtualScrollerComponent;
    @ViewChild("InputSearch", { static: false }) inputSearch: any;
    //данные
    private _dataSource: Array<any>;
    @Input()
    get DataSource(): Array<any> {

        if (this._dataSource != null && this._dataSource.length) {
            let errors: string[] = [];
            if (!this.KeyField) {
                errors.push("Не задано наименование поля ключа - KeyField");
            }
            if (!this.RowTemplate && !this.DisplayField) {
                errors.push("Не задано наименование поля ключа - DisplayField");
            }
            errors.forEach((error: string) => console.error(error));
            if (errors.length) {
                return [];
            }
        }

        return this._dataSource;
    }

    private dSChange: any; // признак изменения источника данных
    set DataSource(items: Array<any>) {
        this.dSChange = this.focusLI;

        //ищем выбранные ранее записи, для простановки IsCheck
        let selectedRows = {};
        if (this._dataSource) {
            this._dataSource
                .filter((item: ListItem) => item.IsCheck)
                .forEach((item: ListItem) => {
                    selectedRows[item.Data[this.KeyField]] = 1;
                })
        }

        let result: any[] = [];
        (items || []).forEach((item, index) => {
            let listItem = new ListItem();
            listItem.Data = item;
            listItem.IsCheck = selectedRows[item[this.KeyField]] == 1;
            listItem.Index = index;
            result.push(listItem);
        });
        this._dataSource = result;
        this.dataBinding();
    }
    @Input()
    set ListItemSource(items: ListItem[]) {
        //if (items[0] instanceof ListItem) {
        this._dataSource = items;
        //}
    }

    createListItem(Data: any) {
        let LI = new ListItem();
        LI.Data = Data;
        return LI;
    }

    @Input()
    ControlId: string; //уникальный идентификатор ListView
    @Input()
    KeyField: string;
    @Input()
    DisplayField: string;
    @Input()
    AdditionalField: string;
    @Input()
    AggregateFieldName: string[];//поля для поиска
    @Input()
    IsSelected: boolean = false;//добавляет элемент checkbox для выборки элементов в списке
    @Input()
    IsRemoved: boolean = false;//добавляет кнопку убрать, для удаления выбранных
    @Input()
    HeaderText: string;//заменяет надпись "Всего" на настроенную
    @Input() Filter: string | any;//фильтр pipes для фильтрации по значению
    @Input() SearchFilter: string;//поиск по записям


    @Input()
    IsFocused: boolean = false;//клик по строке делает элемент фокусированным, нужен для визуализации, на каком элементе сейчас курсор, 
    //т.к.при IsSelected не понятно что конкретно выделено, нужен фокус, например для обновления View справа от списка.
    //отличие поведения от грида в том, что ListView может использоваться как навигационная панель,
    //для этого нужно отмечать то, что в текущий момент выбрано в списке

    @Input()
    OffsetBottom: number;

    @Input() RowTemplate: TemplateRef<any>;

    @Input()
    set ChangeDetection(val: number) { //нужен для отслеживания изменений, вызывается для обновления чекбоксов, передавать timestamp от new Date()
        this.updateItemsSelectLength();
    }

    @Input() Height: number;
    @Input() IsHeaderCompact: boolean;//отображение заголовка только с чекбоксом "выбрать все и поиском", используется н-р в DropDownBox
    @Input() autoFocusSearch: boolean;//при отображении поисковой строки, устанавливает фокус в поиск
    @Input() orderListEnable: boolean;//устанавливает автоматически сортировку по DisplayField, по умолчанию отключено
    @Input() parentScroll: any;

    /* events */
    //события на которые можно подписаться
    @Output() OnItemClick = new EventEmitter<any>();
    @Output() OnItemCheckClick = new EventEmitter<any>();
    @Output() OnRemoveListItem = new EventEmitter<any>();


    //PRIVATE PROPERTIES
    public loadingGrid: boolean = true;     
    public isSearchShow: boolean;
    public get labelHeadText(): string {
        return ((this.HeaderText || AppLocalization.Total) + ': ') + this.itemsLength();
    }

    isAllItemsSelect: boolean = false; //выбраны все
    isNotAllItemsSelect: boolean = false; //выбраны не все
    isItemsSelectMoreThenOne: boolean = false; //выбрано больше чем 1
    atLeastOneIndeterminated: boolean = false;
    isAtLeastOneSelected: boolean;
    __search: string;

    public get isNotDataItems(): boolean {
        return this.itemsLength() === 0;
    }

    //свойство, для выделения строк по shift, диапазон
    private rangeSelectedRowsShift = {
        isShiftPress: false,
        startIndex: 0,
        endIndex: -1,
        setDefault: function () {
            //this.startIndex = 0;
            this.endIndex = -1;
            this.isShiftPress = false;
            return this;
        },
        reverse: function () {
            if (this.startIndex > this.endIndex) {
                let val = this.startIndex;
                this.startIndex = this.endIndex;
                this.endIndex = val;
            }
            return this;
        }
    }
    //служебная переменная, видимые строки при скролле
    visibleScrollElements: any;
    //элемент на котором установлен фокус
    focusedListItem: any;
    
    listView: ListView;


    //====================================
    //METHODS
    //====================================
    constructor(private elRefListView: ElementRef) { 
        this.listView = this;
    }

    ngOnInit(): void {
        if (!this.ControlId) {
            this.ControlId = "listView-" + this.generateUniqueId().toString();
        }
        GlobalValues.Instance.Page.ListViews = GlobalValues.Instance.Page.ListViews || {};
        GlobalValues.Instance.Page.ListViews[this.ControlId] = this;

        if(this.parentScroll) {
            this.resizeVirtualScroll = () => {};
        }
    }

    ngAfterViewInit(): void {

        this.resizeVirtualScroll();
        this.rowSearchExpanded();

        $(window).resize(() => this.resizeVirtualScroll());
        $(document).keydown((event: any) => this.onKeyDownDataGrid(event));
        $(document).keyup((event: any) => this.onKeyUpDataGrid(event));
        this.virtualScroll.scrollAnimationTime = 0;

        setTimeout(() => this.loadingGrid = false, 100);
        if (this.autoFocusSearch) this.inputSearchFocus();
    }
    
    ngOnDestroy(): void {
        $(window).off('resize');
    }

    /*@HostListener('document:keydown', ['$event'])*/ onKeyDownDataGrid(event: KeyboardEvent) {

        if (event.key === 'Shift') {
            this.keyPressShiftDisableSelect();
        }
        event.stopPropagation();
    }

    /*@HostListener('document:keyup', ['$event'])*/ onKeyUpDataGrid(event: KeyboardEvent) {
        if (event.key === 'Shift') {
            this.rangeSelectedRowsShift.setDefault();
            this.keyPressShiftDisableSelect(false);
        }
        event.stopPropagation();
    }

    //вычиление позиции фокуса при удалении позиций в списке или превоначальной загрузке
    private focusLI() {
        let focusFirstLI: any = () => {
            let itemResult = this.virtualScroll.items[0];
            itemResult.IsFocused = true;
            this.focusedListItem = itemResult;
        };

        if (this.IsFocused) {

            let items = this.getVisibleItems();
            if (!items.length) {
                this.focusedListItem = null;
            } else {
                if (!this.focusedListItem) {
                    focusFirstLI();
                } else {
                    let focusedDSLI: ListItem = items.find((x: ListItem) => x.Data[this.KeyField] == this.focusedListItem.Data[this.KeyField]);
                    if (!focusedDSLI) { // удалили сфокусированную строку
                        focusFirstLI();
                    } else { // перезаписываем ранее сфокусированную строку, т.к. был загружен новый массив
                        focusedDSLI.IsFocused = true;
                        this.focusedListItem = focusedDSLI;
                    }
                }
            }

        }
    }
    //фокус на эелементе поиска
    private inputSearchFocus() {
        if (this.inputSearch && this.inputSearch.focus) this.inputSearch.focus();
    }
    //полнотекстовый поиск по таблице
    private searchTextInputTimeout: any;//NodeJS.Timer;
    public searchTextInput(event: any) {

        clearTimeout(this.searchTextInputTimeout);

        this.searchTextInputTimeout = setTimeout(() => {
            this.SearchFilter = event;
        }, 1000);
    }
    //служебная функция, отключающая выделение html при работе с выделением строк по Shift
    private keyPressShiftDisableSelect(disable: boolean = true) {
        if (disable) $('body').addClass('not-user-select-html');
        else $('body').removeClass('not-user-select-html');
    }
    //служебная функция для столбца checkbox
    public mouseenterCheckColumn(event: any) {
        $(event.target).find('check-box-ro5').addClass('hover-cell');
    }
    public mouseleaveCheckColumn(event: any) {
        $(event.target).find('check-box-ro5').removeClass('hover-cell');
    }
    //служебная функция подгона высоты virtualScroll
    resizeVirtualScroll() {
        let offset = $(this.elRefListView.nativeElement).find('.virtualScrollBody').offset();
        let height = this.Height || ($(window).height() - offset.top - (this.OffsetBottom || 0));
        $(this.elRefListView.nativeElement).find('.virtualScrollBody').css({ 'height': `calc(${height}px)` });

        this.virtualScroll.refresh();
    }
    //служебная функция, подписка на expand поиска
    private rowSearchExpanded() {
        $('#searchPanel_' + this.ControlId)
            .on('shown.bs.collapse',
                () => {
                    this.resizeVirtualScroll();
                    this.inputSearchFocus();
                })
            .on('hidden.bs.collapse',
                () => {
                    this.resizeVirtualScroll();
                });
    }
    private generateUniqueId() {
        let fnc = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return Date.now() + fnc(10, 100);
    }
    //список полей, по которым осущесвляется поиск - Object
    private resultFieldsSearch: string[];
    public getFieldsSearch() {
        if (!this.resultFieldsSearch) {
            this.resultFieldsSearch = [this.DisplayField];
            if (this.AdditionalField) this.resultFieldsSearch.push(this.AdditionalField);
            if (this.AggregateFieldName) this.resultFieldsSearch = this.resultFieldsSearch.concat(this.AggregateFieldName);
        }
        return this.resultFieldsSearch;
    }

    //отлавливания события event, костыль для Firefox
    private checkBoxEvent: any;
    public rowCheckClick(item: ListItem, event: any) {
        if (this.IsFocused) {
            //item.IsCheck = event.checked;
            this.OnItemCheckClick.emit(Object.assign(item, { IsCheck: this.checkBoxEvent.checked }));
            event.stopPropagation();
        }
    }
    public itemCheck(event: any) {
        this.checkBoxEvent = event;
    }
    itemClick(item: ListItem | any, event?: any, index?: number) {

        if (this.IsFocused) {
            if (this.focusedListItem) this.focusedListItem.IsFocused = false;
            //let itemList = this.DataSource.find((x: ListItem) => x.IsFocused);
            //if (itemList) (<ListItem>itemList).IsFocused = false;
            item.IsFocused = true;
            this.focusedListItem = item;
        }
        else if (this.IsSelected) {

            let index = this.DataSource
                .map((x: ListItem) => x.Data)
                .findIndex(x => x[this.KeyField] === item.Data[this.KeyField]);

            if ((event || {}).shiftKey) {

                if (this.rangeSelectedRowsShift.endIndex !== -1 && this.rangeSelectedRowsShift.endIndex > index) {
                    for (let inc = this.rangeSelectedRowsShift.endIndex; inc > index; inc--) {
                        (<ListItem>this.DataSource[inc]).IsCheck = false;
                    }
                }

                this.rangeSelectedRowsShift.endIndex = index;
                this.rangeSelectedRowsShift
                    .reverse();

                //делаем выделение
                for (let inc = this.rangeSelectedRowsShift.startIndex; inc <= this.rangeSelectedRowsShift.endIndex; inc++) {
                    (<ListItem>this.DataSource[inc]).IsCheck = true;                    
                }

                item = this.DataSource.slice(this.rangeSelectedRowsShift.startIndex, this.rangeSelectedRowsShift.endIndex + 1);
            }
            else {
                if (!item.IsIndeterminate) { // чекнутая или нечекнутая строка
                    item.IsCheck = !item.IsCheck;
                } else {
                    item.IsIndeterminate = false;
                    item.IsCheck = false;   //на всякий случай - это статмент лишний на данный момент и будем лишним, если будут всегда справедливы условия:
                    //чекнутая           - item.IsCheck && !item.IsIndeterminate
                    //нечекнутая         - !item.IsCheck && !item.IsIndeterminate
                    //частично-выбранная - !item.IsCheck && item.IsIndeterminate
                }

                this.rangeSelectedRowsShift.startIndex = index;
            }

            this.updateItemsSelectLength();
        }
        item['index'] = index;
        this.OnItemClick.emit(item);
    }

    public onAllCheckClick(event: any) {
        if (this.virtualScroll.items) {
            this.virtualScroll.items.forEach(item => {
                item.IsCheck = event.checked;
                if (!item.IsCheck) {
                    item.IsIndeterminate = false;
                }
            });
        }

        this.OnItemCheckClick.emit(null);
        this.updateItemsSelectLength();
    }

    public itemsLength() {
        //ищем по virtualScroll, т.к. в случае фильтра - Pipes:filterRow, мы не получаем актуальную инфу по отображаемым данным
        //this.virtualScroll.items - показывает все записи в virtualScroll, которые мы загрузили в _dataSource и отфильтровали
        if (this.virtualScroll) return this.virtualScroll.items.length;

        return 0;
    }

    public updateVirtualScrollItems(items: any[]) {
        this.visibleScrollElements = items;

        if (this.dSChange) {
            this.dSChange();
            delete this.dSChange;
        }

        this.updateItemsSelectLength();
    }

    public verifyRemove(popover: any) {

        let selectedRows = this.getSelectedRows();

        if (selectedRows.length == this.virtualScroll.items.length) {
            popover.open();
        } else {
            this.removeSelect(selectedRows);
        }
    }

    public removeAllItems() {
        this.removeSelect(this.virtualScroll.items.map((item: ListItem) => { return item.Data; }));
    }

    private removeSelect(rows: any[]) {

        /*let items = this.DataSource
            .map((item: ListItem) => item.Data)
            .filter((item: any) => {
                return rows
                    .find(x => x[this.KeyField] === item[this.KeyField]) == null;                
            });
        this.DataSource = items;*/

        this.OnRemoveListItem.emit(rows);//items);
    }

    private dataBinding() {
        delete this.resultFieldsSearch;
        this.inputSearchFocus();
    }

    //PUBLIC METHODS

    getVisibleItems() { // плохое назваине потому что this.visibleScrollElements - подмножество this.virtualScroll.items
        return this.virtualScroll.items;
    }

    getItem(ind: number) {
        let items = (this.getVisibleItems() || []);
        if (items.length) {
            return items[ind];
        }
        return null;
    }
    getSelectedRows() {
        let result: any[] = [];
        if (this.IsSelected) {
            if (this.virtualScroll) {
                let items = this.virtualScroll.items;
                result = (items || []).filter((item: ListItem) => item.IsCheck).map((item: ListItem) => item.Data);
            }
        }
        return result;
    }
    getIndeterminatedRows() {
        let result: any[] = [];
        if (this.IsSelected) {
            if (this.virtualScroll) {
                let items = this.virtualScroll.items;
                result = (items || []).filter((item: ListItem) => item.IsIndeterminate).map((item: ListItem) => item.Data);
            }
        }
        return result;
    }
    setSelectedRows(items: any | any[]) {

        if (!items) return;
        if (!this.KeyField) return;
        if (!this._dataSource || !this._dataSource.length) return;

        let ids: any[] = [];
        if (items instanceof Array) {
            (items || []).forEach((item: any) => ids.push(item[this.KeyField]));
        }
        else {
            ids.push(items[this.KeyField]);
        }
        ids.forEach((id: any) => {
            let itemList = this._dataSource.find((x: ListItem) => x.Data[this.KeyField] === id);
            if (itemList) (<ListItem>itemList).IsCheck = true;
        });
    }
    updateItemsSelectLength() {
        let itemsSelectLength = this.getSelectedRows().length;
        let itemsLength = this.itemsLength();

        this.isAllItemsSelect = itemsLength > 0 && itemsSelectLength === itemsLength;
        this.isNotAllItemsSelect = itemsSelectLength > 0 && itemsSelectLength < itemsLength;
        this.isItemsSelectMoreThenOne = itemsSelectLength > 1;
        this.isAtLeastOneSelected = itemsSelectLength > 0;
        this.atLeastOneIndeterminated = this.getIndeterminatedRows().length > 0;
    }

    //сброс фокуса
    dropFocus() {
        this.focusedListItem.IsFocused = this.focusedListItem.IsCheck = false;
        delete this.focusedListItem;
    }
}

export class ListItem {
    IsCheck: boolean = false;
    IsIndeterminate: boolean = false;
    IsFocused: boolean = false;
    Data: any;
    Index?: number;
}
