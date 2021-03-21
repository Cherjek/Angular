import { AppLocalization } from 'src/app/common/LocaleRes';
import {
    Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, TemplateRef, ElementRef,
    ViewChild, AfterViewInit, AfterViewChecked, ComponentFactoryResolver, HostListener, ChangeDetectorRef, Directive
} from '@angular/core';

import { OrderByPipe } from "../../shared/rom-pipes/order-by.pipe";
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { DetailsRow } from "../ListComponentCommon/DetailsRow/DetailsRow";

declare var $: any;

export abstract class DataGridBase {

    constructor(protected elRefDataGrid: ElementRef) {
    }

    //ABSTRACT
    //input abstract
    protected abstract Editable: Editable;
    protected abstract SelLimit: number;
    protected abstract HeaderHeight: any;
    protected abstract DataGridOptions: DataGridOptions;
    protected abstract ParentElementRef: ElementRef;
    protected abstract Columns: Array<any>;
    protected abstract KeyField: string;
    protected abstract DetailRow: DetailsRow;
    protected abstract DataSource: Array<any>;
    //output abstract
    protected abstract onAllRowsSelected: EventEmitter<any>;
    protected abstract onEditingCellApply: EventEmitter<any>;
    protected abstract onRowClick: EventEmitter<any>;
    protected abstract onRowExpanded: EventEmitter<any>;
    protected abstract onActionButtonClicked: EventEmitter<any>;
    protected abstract onStatusMouseEnter: EventEmitter<any>;
    

    protected abstract getSelectDataRows(): any;
    protected abstract virtualScroll: VirtualScrollerComponent;
    protected abstract dateTimeCellTemplate: TemplateRef<any>;
    protected abstract dateCellTemplate: TemplateRef<any>;
    protected abstract decimalCellTemplate: TemplateRef<any>;
    protected abstract resizeGrid(): void;
    protected abstract scrollGridRefresh(): void;
    

    protected _columns: Array<any> = [];
    protected _detailRow: DetailsRow = null;
    protected _selectionRowMode: SelectionRowMode;
    protected _dataSource: Array<any>;



    //PUBLIC
    SelectionRow: SelectionRow;
    Rows: DataGridRow[];
    SearchFilter: string;//Клиентский фильтр/поиск по всем совпадениям во всех колонках, строка поиска над гридом

    /**
     *
     * COLUMNS REGION
     *
     */
    protected initColumns(): void {
        for (let i = 0; i < this._columns.length; i++) {
            this.initColumn(this._columns[i]);
        }
    }
    protected initColumn(column: DataGridColumn): void {
        if (column.CellTemplate == null) {
          if (column.DataType === DataColumnType.DateTime) {
              column.CellTemplate = this.dateTimeCellTemplate;
              //column.TextAlign = DataColumnTextAlign.Center;
          }
          else if (column.DataType === DataColumnType.Date) {
              column.CellTemplate = this.dateCellTemplate;
              //column.TextAlign = DataColumnTextAlign.Center;
          }
          else if (column.DataType === DataColumnType.Decimal) {
              column.CellTemplate = this.decimalCellTemplate;
          }
        }
        if (Math.abs(column.Sortable) === 1) this.columnSort = column;
    }
    /*getFilterColumns(): DataGridColumn[] {
        let columns = [];
        for (let c in this.linkFilterColumn) {
            columns.push(this.linkFilterColumn[c]);
        }
        return columns;
    }*/
    /**
     *
     * END COLUMNS REGION
     *
     */




    ////////PROPERTY protected/////////////
    //служебная переменная, видимые строки при скролле
    protected get headerTextTemplatePattern() {
        return `${AppLocalization.Selected}: ${this.getSelectDataRows().length} из ${this.itemsLength()}`;
    }
    protected orderBy: OrderByPipe = new OrderByPipe();

    private onKeyDownDataGrid(event: KeyboardEvent) {

        if (event.key === 'Shift') {
            this.keyPressShiftDisableSelect();
        }
        event.stopPropagation();
    }

    private onKeyUpDataGrid(event: KeyboardEvent) {

        if (event.key === 'Shift') {
            this.rangeSelectedRowsShift.setDefault();
            this.keyPressShiftDisableSelect(false);
        }
        if (this.Editable && this.Editable.isEditing) {
            if (event.keyCode === 27 || event.keyCode === 13) {
                this.keyInputCellEdit(event);
            }
        }
        event.stopPropagation();
    }

    //отступ справа для заголовков, смещены относительно ячеек body из-за присутствия скрола в body
    protected registerEvent() {
        $(document).keydown((event: any) => this.onKeyDownDataGrid(event));
        $(document).keyup((event: any) => this.onKeyUpDataGrid(event));
        this.registerWindowResizeEvent();
    }
    protected registerWindowResizeEvent(stop?: boolean) {
        if (stop) $(window).off('resize');
        else $(window).resize(() => this.resizeGrid());
    }

    // свойство, для выделения строк по shift, диапазон
    protected rangeSelectedRowsShift = {
        isShiftPress: false,
        startIndex: 0,
        endIndex: -1,
        setDefault: function (start?: number) {
            if (start != undefined) this.startIndex = start;
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

    protected isScrollToRow: boolean = false;

    protected SelectedRows: any = {};
    protected EditingCells: any = {};//редактируемые ячейки, содержит EditingCell
    protected EditingRows: any = {};//редактируемая строка, содержит object

    protected dataColumnType = DataColumnType;
    protected dataColumnTextAlign = DataColumnTextAlign;

    /////////FUNCTION/////////////    
    //запрет выбора по чекбоксу и кнопок action, если редактируется
    protected get __isNotActionWhileEditOrCheck() {
        return (this.isMultiSelect && this.SelectionRow.isItemsSelect) || (this.Editable && this.Editable.isEditing);
    }
    protected get __isNotCheckWhileEdit() {
        return (this.Editable && this.Editable.isEditing);
    }
    protected get __isNotCheckIfLimitFinish() {
        if (this.SelLimit !== undefined) {
            return (this.getSelectDataRows().length - this.SelLimit == 0);
        }
        return false;
    }
    protected columnsLinkForSearch: any;
    //проверка изменений высоты header грида, ресайз виртуального скрола если это так
    protected lastHeadHeight = 0;
    protected resizeGridHeader() {
        let header = $(this.elRefDataGrid.nativeElement).find('.data-grid-header');
        let headHeight = header.height();
        if (this.lastHeadHeight != headHeight) {
            this.lastHeadHeight = headHeight;
            console.log("resize grid header, new height: " + this.lastHeadHeight);
            this.resizeGrid();
        }
    }
    //служебная функция подгона высоты virtualScroll
    protected resizeVirtualScroll() {

        $(this.elRefDataGrid.nativeElement).find('.virtualScrollBody').css({ 'height': `0px` });

        setTimeout(() => {
            let winHeight: number;
            let position: any;
            let startPosition = 0;
            if (this.ParentElementRef) {
                winHeight = $(this.ParentElementRef).height() - 2;
                position = $(this.elRefDataGrid.nativeElement).find('.virtualScrollBody').position();
                startPosition = this.DataGridOptions.isSearchVisibility ? 50 : 0;
            }
            else {
                winHeight = $(window).height();
                position = $(this.elRefDataGrid.nativeElement).find('.virtualScrollBody').offset();
            }

            let height = winHeight - startPosition - position.top;
            $(this.elRefDataGrid.nativeElement).find('.virtualScrollBody').css({ 'height': `calc(${height}px)` });

            setTimeout(() => this.scrollGridRefresh(), 100);
        }, 100);
    }
    //служебная функция, число строк в гриде, даже с учетом virtual scroll, показывает сколько всего в DataSource записей, и учитывает фильтр
    protected itemsLength() {
        if (this.virtualScroll && this.virtualScroll.items) return this.virtualScroll.items.length;
        return 0;
    }
    //служебная функция, для проверки отмеченных частично
    //служебная функция, для проверки отмеченных всех
    protected updateItemsSelectLength() {
        if (this.SelectionRow) {
            let itemsSelectLength = this.getSelectDataRows().length;
            let itemsLength = this.itemsLength();

            this.SelectionRow.isAllItemsSelect = itemsLength > 0 && itemsSelectLength === itemsLength;
            this.SelectionRow.isNotAllItemsSelect = itemsSelectLength > 0 && itemsSelectLength < itemsLength;
            this.SelectionRow.isItemsSelect = itemsSelectLength > 0;
            this.SelectionRow.isItemsSelectMoreThenOne = itemsSelectLength > 1;
        }
    }
    //служебная функция для столбца checkbox
    protected mouseenterCheckColumn(event: any) {
        $(event.target).find('check-box-ro5').addClass('hover-cell');
    }
    protected mouseleaveCheckColumn(event: any) {
        $(event.target).find('check-box-ro5').removeClass('hover-cell');
    }
    //служебная функция, отключающая выделение html при работе с выделением строк по Shift
    protected keyPressShiftDisableSelect(disable: boolean = true) {
        if (disable) $('body').addClass('not-user-select-html');
        else this.removeNotUserSelectHtml();
    }
    protected removeNotUserSelectHtml() {
        $('body').removeClass('not-user-select-html');
    }


    /**
     * Функции взаимодействия с гридом, кнопки action, сортировка, выделение строки...
     * 
     */
    //полнотекстовый поиск по таблице
    protected searchTextInputTimeout: any;//NodeJS.Timer;
    protected searchTextInput(event: any) {

        clearTimeout(this.searchTextInputTimeout);

        this.searchTextInputTimeout = setTimeout(() => {
            this.SearchFilter = event;
        }, 1000);
    }

    //сотрировка по клику на заголовок
    protected headerSortClick(column: DataGridColumn, sortable?: number) {
        column.Sortable = sortable || (column.Sortable == null ? 1 : column.Sortable > 0 ? -1 : 1);
        this.columnSort = column;

        let asc = this.columnSort.Sortable === 1;
        this._dataSource = this.orderBy.transform(this.DataSource, this.columnSort.Name, asc, column.AggregateFieldName, column.DataType === DataColumnType.DateTime);
        this.Rows.sort((row1: DataGridRow, row2: DataGridRow) => {

            let __rowA = asc ? row1 : row2;
            let __rowB = asc ? row2 : row1;

            return this.orderBy.orderByComparator(__rowA.Data[this.columnSort.Name], __rowB.Data[this.columnSort.Name]);
        });
        //TEST, проверка совпадения строк после сортировки
        //for (let i = 0; i < 10; i++) {
        //    console.log(this.Rows[i].Data[this.KeyField] + '|' + this._dataSource[i][this.KeyField]);
        //}
    }

    protected sendRowsSelectedEvent() {
        this.onAllRowsSelected.emit({
            isAllItemsSelect: this.SelectionRow.isAllItemsSelect,
            isNotAllItemsSelect: this.SelectionRow.isNotAllItemsSelect
        });
    }
    protected applyPopupInlineCellEdit(event: any, column: DataGridColumn, item: any) {

        let id = item[this.KeyField];
        this.closePopupInlineCellEdit(event, column, item);

        if (this.EditingCells[id][column.Name]) {
            this.onEditingCellApply.emit(this.EditingCells[id][column.Name]);
        }

        event.stopPropagation();
    }
    protected closeAllPopupInlineCellEdit() {
        let keys = Object.keys(this.EditingCells);
        for (let key in keys) {
            let row = this.EditingCells[keys[key]];
            let keysCol = Object.keys(row);
            for (let keyCol in keysCol) {
                let editingCell = row[keysCol[keyCol]];
                this.closePopupInlineCellEdit(event, editingCell.column, editingCell.data);
            }
        }
    }
    protected closePopupInlineCellEdit(event: any, column: DataGridColumn, item: any) {

        let id = item[this.KeyField];
        if (this.EditingCells[id][column.Name]) this.EditingCells[id][column.Name].isEditing = false;
        if (this.EditingRows[id]) delete this.EditingRows[id];

        this.Editable.isEditing = Object.keys(this.EditingRows).length > 0;

        event.stopPropagation();
    }
    protected keyInputCellEdit(event: any) {
        let keys = Object.keys(this.EditingCells);
        for (let key in keys) {
            let row = this.EditingCells[keys[key]];
            let keysCol = Object.keys(row);
            for (let keyCol in keysCol) {
                let editingCell = row[keysCol[keyCol]];
                if (editingCell.isEditing) {
                    if (event.keyCode === 27) {
                        //Esc
                        this.closePopupInlineCellEdit(event, editingCell.column, editingCell.data);
                    }
                    else if (event.keyCode === 13) {
                        //Enter
                        this.applyPopupInlineCellEdit(event, editingCell.column, editingCell.data);
                    }
                }
            }
        }
    }
    //включение редактирования ячейки после клика по ней
    protected enableInlineEditable(event: any, column: DataGridColumn, item: any) {
        if (this.Editable && this.Editable.editMode === EditableMode.Inline) {
            let isEditAccess = !(this.SelectionRow && this.SelectionRow.isItemsSelect);
            if (isEditAccess && (column.IsEdit === undefined || column.IsEdit)) {

                this.closeAllPopupInlineCellEdit();//редактировать можно только одну ячейку

                let id = item[this.KeyField];
                if (!this.EditingCells[id]) this.EditingCells[id] = {};
                if (!this.EditingCells[id][column.Name]) this.EditingCells[id][column.Name] = Object.assign(new EditingCell(), {
                    isEditing: true,
                    id: id,
                    column: column,
                    data: item
                });
                else {
                    this.EditingCells[id][column.Name].isEditing = true;
                }

                this.EditingCells[id][column.Name].value = item[column.Name];

                this.EditingRows[id] = item;

                this.Editable.isEditing = true;

                event.stopPropagation();
            }
        }
    }
    //клик по ячейке
    protected cellClick(event: any, column: DataGridColumn, item: any) {
        this.enableInlineEditable(event, column, item);
    }
    //выделение строки
    protected rowSelect(item: any, event: any) {

        //проверка на shift при SelLimit, ограниченном выборе кол-ва строк
        if (this.SelLimit !== undefined && event.shiftKey) return;

        if (this.SelectionRow && !this.__isNotCheckWhileEdit) {
            let key = item[this.KeyField];

            if (this.__isNotCheckIfLimitFinish && this.SelectedRows[key] == null) return;

            let selectObject: any = (this.Rows || []).find(x => x.Data[this.KeyField] === key);
            selectObject.IsCheck = this.SelectedRows[key] == null;
            if (!selectObject.IsCheck) {
                if (selectObject.IsIndeterminate) selectObject.IsIndeterminate = false;
            }

            if (this.SelectionRow.mode === SelectionRowMode.Single) {
                this.SelectedRows = {};
                this.SelectedRows[key] = selectObject;
            } else {
                //multiselect
                let dataItems = this.virtualScroll.items;
                let index = dataItems.findIndex(x => x[this.KeyField] === key);

                if (!event.shiftKey) {

                    //клик по строке, если выбрана одна строка, это еще не мультиселект, сбрасывать предыдущий выбор
                    //устанавливать новый, если больше одной строки, не менять ничего
                    //if (!isCheck && Object.keys(this.SelectedRows).length < 2) this.SelectedRows = {};

                    if (this.SelectedRows[key]) delete this.SelectedRows[key];
                    else this.SelectedRows[key] = selectObject;

                    this.rangeSelectedRowsShift.startIndex = index;
                }
                else if (event.shiftKey) {

                    if (this.rangeSelectedRowsShift.endIndex !== -1 && this.rangeSelectedRowsShift.endIndex > index) {
                        for (let inc = this.rangeSelectedRowsShift.endIndex; inc > index; inc--) {
                            let key = dataItems[inc][this.KeyField];
                            let selectObject = (this.Rows || []).find(x => x.Data[this.KeyField] === key);
                            selectObject.IsCheck = false;
                            delete this.SelectedRows[key];
                        }
                    }

                    this.rangeSelectedRowsShift.endIndex = index;
                    this.rangeSelectedRowsShift
                        .reverse();

                    //делаем выделение
                    let rowsShift: any[] = [];
                    for (let inc = this.rangeSelectedRowsShift.startIndex; inc <= this.rangeSelectedRowsShift.endIndex; inc++) {
                        key = dataItems[inc][this.KeyField];
                        let row = (this.Rows || []).find(x => x.Data[this.KeyField] === key);
                        row.IsCheck = true;
                        this.SelectedRows[key] = row;
                        rowsShift.push(row);
                    }

                    selectObject = rowsShift;
                }

                this.updateItemsSelectLength();
            }

            this.onRowClick.emit(selectObject);
        }
    }
    //выделение всех строк
    protected setAllRowsSelect(check: boolean) {
        this.SelectedRows = {};
        if (this.Rows) {
            const rows = this.Rows.filter(row =>
                this.virtualScroll.items.find(vsi => vsi[this.KeyField] === row.Data[this.KeyField]) != null
            );

            let count = rows.length;
            if (this.SelLimit !== undefined && this.SelLimit < count) count = this.SelLimit;
            for (let i = 0; i < count; i++) {
                const key = rows[i].Data[this.KeyField];
                rows[i].IsCheck = check;
                rows[i].IsIndeterminate = false;
                if (check) this.SelectedRows[key] = rows[i];
                else delete this.SelectedRows[key];
            }
        }
    }
    //событие выделение всех строк
    protected allRowSelect(event: any): void {

        this.setAllRowsSelect(event.checked);

        this.updateItemsSelectLength();
        this.sendRowsSelectedEvent();
    }
    //раскрытие/скрытие строки
    protected btnExpandedClick(item: any, event: any, dataTarget: string) {
        if (this.DetailRow.isRowExpanded(item[this.KeyField])) {
            this.rowCollapsed(item, event, dataTarget);
        } else {
            this.rowExpanded(item, event, dataTarget);
        }
    }
    protected rowCollapsed(item: any, event: any, dataTarget: string) {
        this.DetailRow.collapsed();
        event.stopPropagation();
    }
    protected rowExpanded(item: any, event: any, dataTarget: string) {

        setTimeout(() => {
            this.DetailRow.startAsync();
            this.DetailRow.rowTarget = dataTarget;
            this.DetailRow.rowExpanded = item[this.KeyField];
            this.DetailRow.rowData = item;

            this.DetailRow.expandedCallback = () => {
                this.onRowExpanded.emit({ rowId: item[this.KeyField], row: item });
            }
        },
            50);

        event.stopPropagation();
    }

    //выбор в меню Action записи, т.е. выбор действия(н-р: удалить, редактировать)
    protected actionButtonPopup: any = {
        close: () => { }
    };
    protected actionButton: ActionButtons;
    protected actionButtonMenuClicked(menuItem: ActionButtons, item: any, index: number, popUpAction: any, event: any, isConfirm?: boolean) {

        if (!isConfirm && menuItem.IsConfirm) {
            this.actionButton = menuItem;
        }
        else {
            this.onActionButtonClicked.emit({ action: menuItem.Name, item: item, index: index });
            popUpAction.close();
        }

        event.stopPropagation();
    }
    protected lastOpenActionButtonPopover: any = {
        popover: null,
        index: -1,
        setDefault: function () {
            this.popover = null;
            this.index = -1;
        }
    }

    protected correctActionBttnPopover() {
        setTimeout(() => {
            // try {
            if (this.lastOpenActionButtonPopover.popover && this.lastOpenActionButtonPopover.popover.isOpen) { // проверка нужна потому что на ActionButton могут нажать очень быстро несколько раз подряд
                let el = document.getElementsByTagName('ngb-popover-window')[0];

                let WH = window.innerHeight; // высота вьюпорта

                // console.log(el.attributes, el.attributes.item(3));
                let styleAttrValue: string = el.attributes.item(3).value;

                let poY: number = Number(styleAttrValue.substring(styleAttrValue.indexOf('px, ') + 4,
                    styleAttrValue.indexOf('px)', styleAttrValue.indexOf('px, ') + 4))); // транслейт поповера по оси Y от начала координат - style="... transform: translate(poX, poY) ..."

                let poHeight: number = el.clientHeight; // высота поповера
                // console.log(styleAttrValue,
                //             styleAttrValue.indexOf('px, '),
                //             styleAttrValue.indexOf('px)', styleAttrValue.indexOf('px, ') + 4),
                //             styleAttrValue.substring(styleAttrValue.indexOf('px, ') + 4, styleAttrValue.indexOf('px)', styleAttrValue.indexOf('px, ') + 4)));
                if (poY + poHeight > WH) { // поповер вышел за пределы вьюпорта снизу
                    this.lastOpenActionButtonPopover.popover.placement = "top";
                }
            }
            // } catch(err) {
            //     console.log(err);
            //     this.correctActionBttnPopover();
            // }
        }, 300); // задержка нужна чтобы успел инициализироваться el.attributes.item(3) - атрибут style в поповере
    }

    protected openActionButtonPopover(popUpAction: any, index: number) {
        if (this.lastOpenActionButtonPopover.popover && this.lastOpenActionButtonPopover.index !== index) this.lastOpenActionButtonPopover.popover.close();

        if (!popUpAction.isOpen()) {
            popUpAction.open();
            this.lastOpenActionButtonPopover.popover = popUpAction;
            this.lastOpenActionButtonPopover.index = index;

            this.correctActionBttnPopover();
        }
        else {
            popUpAction.close();
            this.lastOpenActionButtonPopover.setDefault();
        }
    }
    protected hiddenEventActionButtonPopover() {
        delete this.actionButton;
    }

    protected statusMouseEnter(event: any, item: any, statusColumnStruct: StatusColumn) {
        this.onStatusMouseEnter.emit({ item: item, statusColumnStruct: statusColumnStruct });

        //$(event.target).tooltip({ container: 'body', trigger: 'hover' });
    }

    protected statusMouseLeave(event: any) {
    }

    /**
     * PUBLIC METHOD | PROPERTIES ON HTML BOUND (здесь public свойства, для AOT сборки
     * по правилу, bind свойства и методы должны быть public)
     */ 
    // вычисляем высоту скрола и если он есть подставляем 10px иначе -10px
    public get headerMarginRight() {
        const scrollHeight = this.virtualScroll.viewPortInfo.maxScrollPosition;
        return (scrollHeight === 0 ? -1 : 1) * 10 + "px";
    }
    // служебная функция для инициализации ссылок по column.Name на объект column    
    public get __headerHeight() {
        return typeof this.HeaderHeight === "number"
            ? `${this.HeaderHeight}px` : this.HeaderHeight;
    }
    public get isMultiSelect(): boolean {
        if (this.SelectionRow) {
            return this.SelectionRow.mode === SelectionRowMode.Multiple;
        }

        return false;
    }
    public get isNotDataItems(): boolean {
        if (this.virtualScroll && this.virtualScroll.viewPortItems)
            return this.virtualScroll.viewPortItems.length == 0;

        return false;
    }
    public visibleScrollElements: any;
    //в текущий момент сортировка конкретного поля
    public columnSort: any = {
        Name: '',
        Sortable: 1
    }
    public getColumnsObjectItems() {
        if (!this.columnsLinkForSearch) {
            if (this.Columns.length) {
                this.columnsLinkForSearch = {};

                for (let i = 0; i < this.Columns.length; i++) {
                    if ((<DataGridColumn>this.Columns[i]).IsSearch)
                        this.columnsLinkForSearch[(<DataGridColumn>this.Columns[i]).Name] = this.Columns[i];
                }
            }
        }
        return this.columnsLinkForSearch;
    }
    public updateVirtualScrollItems(items: any[]) {
        this.visibleScrollElements = items;
        this.updateItemsSelectLength();
    }
    public getSelectRows(): DataGridRow[] {
        return (this.Rows || []).filter(r => r.IsCheck);
    }
}

export class DataGridOptions {
    isSearchVisibility: boolean;
}

export enum DataColumnTextAlign { Left, Center, Right }
export enum DataColumnType { String, Number, Boolean, Date, DateTime, Decimal, Currency }
export class DataGridColumn {

    Name: string;
    AggregateFieldName: string[];//объединяет значения сущности из разных полей через пробел
    Caption: string;
    DataType: DataColumnType = DataColumnType.String;
    TypeParsing: TypeParsingColumn;//позволяет получить тип ячейки, если в строке для столбца может быть разный тип в ячейке
    Format: string;/*форматирование значений для вывода текста на форму, н-р: yyyy-MM-DD hh:mm:ss*/
    IsEdit: boolean;//возможность редактирования, по умолчанию = true, даже если не задано, и grid.Editable

    TextAlign: DataColumnTextAlign = DataColumnTextAlign.Left;
    AppendFilter: boolean;/*по умолчанию фильтр не включен*/
    FilterValues: any[];
    IsSearch: boolean = true;/*поиск по полю в глобальном поиске по таблице, по умолчанию включено*/
    Visible: boolean = true;/*поиск по полю в глобальном поиске по таблице, по умолчанию включено*/
    IsExport: boolean;

    CellTemplate: TemplateRef<any>;
    ColTemplate: TemplateRef<any>;

    /* WIDTH */
    private _Width: string;
    public get Width(): string {
        return this._Width;
    }
    public set Width(n: string) {
        this._Width = n;
    }

    /* SORT */
    private _sortable: number;
    public get Sortable(): number {
        return this._sortable;
    }
    public set Sortable(n: number) {
        this._sortable = n;
    }
}

export class DataGridRow {
    IsCheck?: boolean;
    IsIndeterminate?: boolean;
    IsFocused?: boolean;
    IsExpanded?: boolean;
    Data?: any;
}

export class ActionButtonConfirmSettings {
    //ConfirmText: string;//текст подтверждения - "Вы уверены, что хотите удалить"
    //ConfirmButtonText: string;//текст подтверждения кнопки - "Удалить"
    constructor(public ConfirmText: string, public ConfirmButtonText: string) { }
}

export class ActionButtons {

    //IsConfirm: boolean;//определяет содержит ли кнопка подтверждение нажатия - н-р кнопка удалить
    constructor(public Name: string, public DisplayText: string, public confirmSettings?: ActionButtonConfirmSettings) {

        this.IsConfirm = (confirmSettings != null);
    }

    IsConfirm?: boolean;
    IsValid(data: any): boolean {
        return true;
    }
}

//используется для задания статуса в строке
export class StatusColumn {
    Field: any | any[];//поле по которому ищем значение
    KeyColor: string;//поле цвет в значении из Field
    KeyDesc: string;//поле описание в значении из Field    

    getColor(item: any) {
        let value = this.getValue(item);
        return value[this.KeyColor];// || this.getValueFromDictionary(value, "FieldColor");
    }

    getDesc(item: any) {
        let value = this.getValue(item);
        return value[this.KeyDesc];// || this.getValueFromDictionary(value, "FieldDesc");
    }

    private getValue(item: any) {
        let value = item[this.Field] || {};
        if (value) {
            if (value instanceof Array) {
                if (value.length)
                    value = value[0];
            }
        }
        return value;
    }
}

export enum SelectionRowMode { Single, Multiple }
export class SelectionRow {
    constructor(mode: SelectionRowMode = SelectionRowMode.Single) {
        this.mode = mode;
    }

    mode: SelectionRowMode;

    //multi mode property
    isAllItemsSelect: boolean; //выбраны все
    isNotAllItemsSelect: boolean; //выбраны не все
    isItemsSelect: boolean; //выбраны записи
    isItemsSelectMoreThenOne: boolean; //выбрано больше чем 1
}

//класс настроек редактирования грида
export enum EditableMode { Inline }
export class Editable {
    isEditing: boolean;//указывает, что грид в текущий момент в режиме редактирования
    editMode: EditableMode;

    constructor() { this.editMode = EditableMode.Inline }
}

class EditingCell {
    isEditing: boolean = false;//ячейка в данный момент редактиоуется
    id: any;
    column: DataGridColumn;//ссылка на стобец
    data: any;//ссылка на строку
    value: any;//значение input box 

    isValidValue: boolean = true;
    isAsyncUpdateValue: boolean = false;//обновление значения, асинхронный вызов сервиса, показывает процесс - loader
}

export class TypeParsingColumn {
    constructor(public __getDataType?: any) {
        if (__getDataType) this.getDataType = __getDataType;
    }

    getDataType: any = (item: any): DataColumnType => {
        return DataColumnType.String;
    }
}