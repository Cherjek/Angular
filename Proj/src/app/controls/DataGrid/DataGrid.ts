import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, TemplateRef, ElementRef, ViewChild, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Utils, DataGridCurrentItemService } from '../../core';
import { Editable, DataGridOptions, DataGridColumn, SelectionRow, SelectionRowMode, ActionButtons, StatusColumn, DataGridRow, DataColumnType } from './index';
import { DataGridBase } from './DataGridBase';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { ExportToXlsx, ExportXlsxOptions } from '../Services/ExportToXlsx';
import { DetailsRow } from '../ListComponentCommon/DetailsRow/DetailsRow';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

const MAX_CLIPBOARD_LENGTH = 3300; // максимальное число строк, которые можно скопировать в буфер
const TEXT_ERROR_LIMIT_CLIPBOARD = AppLocalization.Label68;

@Component({
    selector: 'data-grid-ro5',
    templateUrl: 'data-grid-ro5.component.html',
    styleUrls: ['data-grid-ro5.component.less']
})

export class DataGrid extends DataGridBase implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    @Input() DetailRowButtonContent: any;
    @Input() get Columns(): Array<any> {
        return this._columns;
    }
    set Columns(val: Array<any>) {
        const result: any[] = [];
        val.forEach((col: any) => {
            result.push(Object.assign(new DataGridColumn(), col));
        });
        this._columns = result;
        /// reinit columns
        this.initColumns();
        this.columnsLinkForSearch = null;
    }
    // строка detail
    @Input() get DetailRow(): DetailsRow {
        return this._detailRow;
    }
    set DetailRow(val: DetailsRow) {
        if (val) {
            if (this._detailRow == null) {
                this._detailRow = new DetailsRow();
            }
            this._detailRow = Object.assign(this._detailRow, val);
        }
    }
    // позволяет выбирать одну или несколько строк, появляются чекбоксы слева и выбрать все
    @Input() get SelectionRowMode(): SelectionRowMode {
        return this._selectionRowMode;
    }
    set SelectionRowMode(mode: SelectionRowMode) {
        this.SelectionRow = new SelectionRow(mode);
        this._selectionRowMode = mode;
    }
    @Input() get Filter(): any {
        return this._filter;
    }
    set Filter(val: any) {
        this._filter = val;
        this.onFilterChanged.emit(val);
    }
    public get DataSourceForm() {
        return this._dataSource;
    }
    @Input() get DataSource(): Array<any> {
        const errors: string[] = [];
        if (!this.KeyField) {
            errors.push('Не задано наименование поля ключа - KeyField');
        }
        errors.forEach((error: string) => console.error(error));
        if (errors.length) {
            return [];
        }
        return this._dataSource;
    }
    set DataSource(n: Array<any>) {
        this.Rows = [];
        if (n != null) {
            n.forEach(item => {
                const dataRow = new DataGridRow();
                dataRow.Data = item;
                this.Rows.push(dataRow);

                this.linkDataRows[item[this.KeyField]] = this.Rows[this.Rows.length - 1];
            });
        }
        this._dataSource = n;
        this.dataBinding();
        this.scrollToIndex();
    }
    private _searchBoxStyle = {};
    @Input()
    public get searchBoxStyle() {
        return this._searchBoxStyle;
    }
    public set searchBoxStyle(value) {
        if (Object.prototype.toString.call(value) !== '[object Object]') {
            throw new Error('Input must be an object');
        }
        this._searchBoxStyle = value;
    }
    @Input() KeyField: string;
    @Input() ParentElementRef: ElementRef;
    @Input() RowsTemplate: TemplateRef<any>; // для не табличного вида, list
    @Input() HeaderTemplate: TemplateRef<any>; // шаблон заголовка
    @Input() HeaderHeight: any = 50; // размер header
    @Input() HeaderActionTemplate: TemplateRef<any>; // шаблон заголовка с кнопками action: экспорт, импорт, CRUD операции
    @Input() HeaderTextTemplate = AppLocalization.Total;
    @Input() DataGridOptions: DataGridOptions = {
        isSearchVisibility: true
    };
    // кнопки действий в каждой строке
    @Input() ActionButtons: ActionButtons[] = [];
    // задает настройки поля, по которому подсвечиваем в конце строки поле
    @Input() StatusColumn: StatusColumn;
    // редактирование грида(включает опреации Insert, Update, Delete)
    @Input() Editable: Editable;
    // настройки экспорта в Excel
    @Input() ExportXlsxOptions: ExportXlsxOptions;
    // ограничение на кол-во выбранных строк
    @Input() SelLimit: number;
    /*column filter*/
    // Фильтр грида на клиенте - dataSource | filterRow:'':Filter, указывается столбец по которому сортируем - Filter[Column.Name], и значения, может быть [] и object и простым типом
    public _filter: any;
    @Input() DragAndDropRow = false;
    @ViewChild(VirtualScrollerComponent, { static: true }) public virtualScroll: VirtualScrollerComponent;
    @ViewChild('dateTimeCellTemplate', { static: true }) public dateTimeCellTemplate: TemplateRef<any>;
    @ViewChild('dateCellTemplate', { static: true }) public dateCellTemplate: TemplateRef<any>;
    @ViewChild('decimalCellTemplate', { static: true }) public decimalCellTemplate: TemplateRef<any>;
    @ViewChild('searchInputControl', { static: false }) public searchInputControl: any;
    /* events */
    // события на которые можно подписаться
    @Output() onFilterChanged = new EventEmitter<any>();
    @Output() onRowClick = new EventEmitter<any>();
    @Output() onAllRowsSelected = new EventEmitter<any>();
    @Output() onRowExpanded = new EventEmitter<any>();
    @Output() onActionButtonClicked = new EventEmitter<any>();
    @Output() onStatusMouseEnter = new EventEmitter<any>(); // при наведении на ячейку статус
    // окончание загрузки данных грида
    @Output() onDataBinding = new EventEmitter<any>();
    // edit row
    @Output() onEditingCellApply = new EventEmitter<any>();
    @Output() onError = new EventEmitter<any>();
    @Output() onDragAndDrop = new EventEmitter<any>();
    // ссылка на строки по ключу
    public linkDataRows: any = {};
    public dataColumnType = DataColumnType;

    constructor(public elRefDataGrid: ElementRef,
                public cdRef: ChangeDetectorRef,
                public exportToXlsx: ExportToXlsx,
                public dataGridCurrentItemService: DataGridCurrentItemService) {
        super(elRefDataGrid);
    }

    ngOnInit(): void {
        this.initColumns();
        // плавная анимация прокрутки выглядит не уместно, нужно сразу переходить к позиции скрола
        this.virtualScroll.scrollAnimationTime = 0;
    }

    ngAfterViewInit(): void {
        this.resizeGrid();
        this.registerWindowResizeEvent();
        this.virtualScroll.enableUnequalChildrenSizes = true;
    }

    ngAfterViewChecked(): void {
        this.resizeGridHeader();
    }

    ngOnDestroy(): void {
        this.registerWindowResizeEvent(true);
    }

    private scrollToIndex(): void {
        setTimeout(() => {
            const uniqueKey = this.dataGridCurrentItemService.getUniqueKey();
            const currentItemId: number = this.dataGridCurrentItemService.getCurrentItem() ? this.dataGridCurrentItemService.getCurrentItem()[uniqueKey] : null;
            const currentIndexInVirtualScroll =  currentItemId && this.virtualScroll.items.length ? this.virtualScroll.items.map((el) => el[uniqueKey]).indexOf(currentItemId) : null;
            const currentItemIndex: number = currentIndexInVirtualScroll !== null && currentIndexInVirtualScroll !== -1 ? currentIndexInVirtualScroll : null;
            if (!!currentItemIndex) {
                this.virtualScroll.scrollToIndex(currentItemIndex);
                this.dataGridCurrentItemService.clearCurrentItem();
            }
        }, 0);
    }

    // событие click mouseup верхнего уровня
    onEventMouseupClickMainFrame(event: any) {
        if (this.Editable && this.Editable.isEditing) {
            this.closeAllPopupInlineCellEdit();
        }
    }

    // вспомогательные функции
    // метод прокрутки скролла к определенной записи
    inputSearchFocus() {
        if (this.searchInputControl && this.searchInputControl.focus) {
            this.searchInputControl.focus();
        }
    }

    scrollGridInto(item: any) {
        this.virtualScroll.scrollInto(item);
    }

    scrollGridRefresh() {
        this.virtualScroll.refresh();
    }

    resizeGrid() {
        const interval = setInterval(() => {

            if (this.virtualScroll.items.length === (this.DataSource || []).length) {
                clearInterval(interval);
                this.resizeVirtualScroll();
            }
        }, 200);
    }

    getVisibleItems() {
        return this.virtualScroll.items;
    }

    getItemsLength() {
        return this.itemsLength();
    }

    // EXPORT TO EXCEL
    exportToExcel() {
        let rows;
        if (this.SelectionRow && this.SelectionRow.isItemsSelect) {
            rows = this.getSelectDataRows();
        } else {
            rows = this._dataSource;
        }
        let exportList: any[] = [];
        const fncAggregate = (item: any, cols: string[]) => {
            let result = '';
            cols.forEach(c => result += (item[c] || '') + ' ');
            return result;
        };
        const columns = this.Columns.filter((c: DataGridColumn) => c.IsExport !== false);
        (rows || []).forEach((row: any) => {
            const generateObj = {};
            const multiRowAggregate = {};
            columns.forEach((col: any) => {
                const fieldValAgregate = row[col.Name];
                if (fieldValAgregate != null) {
                    if (fieldValAgregate instanceof Array) {
                        multiRowAggregate[col.Caption] = [];
                        fieldValAgregate.forEach((val: any) => {
                            multiRowAggregate[col.Caption] = col.AggregateFieldName ? (' ' + fncAggregate(val, col.AggregateFieldName)) : '';
                        });
                        generateObj[col.Caption] = '';
                    } else if (fieldValAgregate instanceof Object) {
                        generateObj[col.Caption] = col.AggregateFieldName ? (' ' + fncAggregate(fieldValAgregate, col.AggregateFieldName)) : '';
                    } else {
                        generateObj[col.Caption] = fieldValAgregate + (col.AggregateFieldName ? ' ' + fncAggregate(row, col.AggregateFieldName) : '');
                    }
                } else {
                    generateObj[col.Caption] = '';
                }
            });
            const pusItemsGenerateWithAgregate = [generateObj];
            Object.keys(multiRowAggregate)
                .forEach((field: string) => {
                    generateObj[field] = (multiRowAggregate[field] as string).trim();
                });
            exportList = exportList.concat(pusItemsGenerateWithAgregate);
        });
        this.exportToXlsx.exportAsExcelFile(exportList, this.ExportXlsxOptions);
    }

    copyToClipboard(row?: any) {
        const errors: string[] = [];
        let rows;
        if (row != null) {
            rows = [row];
        } else {
            rows = this.getSelectDataRows();
        }
        if (rows.length > MAX_CLIPBOARD_LENGTH) {
            errors.push(TEXT_ERROR_LIMIT_CLIPBOARD);
        } else {
            const fncAggregate = (item: any, cols: string[]) => {
                let result = '';
                cols.forEach(c => result += item[c] + ' ');
                return result;
            };
            const table = document.createElement('table');
            const columns = this.Columns.filter((c: DataGridColumn) => c.Visible != false);
            (rows || []).forEach((row: any, index: number) => {
                const rowTab = table.insertRow(index);
                columns.forEach((col: DataGridColumn, indexCol: number) => {
                    const cell = rowTab.insertCell(indexCol);
                    let val = row[col.Name];
                    if (col.DataType === DataColumnType.Date) {
                        val = Utils.DateFormat.Instance.getDate(val);
                    } else if (col.DataType === DataColumnType.DateTime) {
                        val = Utils.DateFormat.Instance.getDateTime(val);
                    }
                    cell.innerHTML = val == null ? '' : val + (col.AggregateFieldName ? ' ' + fncAggregate(row, col.AggregateFieldName) : '');
                });
            });
            document.body.appendChild(table);
            if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
                const sel = window.getSelection();
                sel.removeAllRanges();
                if (document.createRange && window.getSelection) {
                    const range = document.createRange();
                    try {
                        range.selectNodeContents(table);
                    } catch (e) {
                        range.selectNode(table);
                    } finally {
                        sel.addRange(range);
                    }
                }
                try {
                    const result: boolean = document.execCommand('copy');  // Security exception may be thrown by some browsers.
                    if (!result) {
                        errors.push(TEXT_ERROR_LIMIT_CLIPBOARD);
                    }
                } catch (ex) {
                    console.warn('Copy to clipboard failed.', ex);
                    errors.push(AppLocalization.Label74);
                }
                sel.removeAllRanges();
            }
            document.body.removeChild(table);
        }
        if (errors.length) {
            this.onError.emit(errors);
        }
    }

    // установка значений check для строк
    setCheckRows(keys: any[]) {
        if (this.Rows && keys && keys.length) {
            keys.forEach(x => {
                const row = this.linkDataRows[x] as DataGridRow;
                row.IsCheck = true;
                this.SelectedRows[x] = row;
            });
        }
    }

    // установка значений indeterminate для строк
    setIndeterminateRows(keys: any[]) {
        if (this.Rows && keys && keys.length) {
            keys.forEach(x => {
                const row = this.linkDataRows[x] as DataGridRow;
                row.IsIndeterminate = true;
                this.SelectedRows[x] = row;
            });
        }
    }

    // инициализация начального представления грида
    initDataGrid() {
        // INIT GRID PROPERTY AFTER SOURCE CHANGE
        this.rangeSelectedRowsShift.setDefault(0);
        this.SelectedRows = {};
        // this.Filter = null;
        // this.SearchFilter = null;
    }

    drop(event: CdkDragDrop<any>) {
        // порядок первых 2 стейтментов имеет значение
        const indexRelativity: number = this.visibleScrollElements[0].Number - 1;
        moveItemInArray(this.visibleScrollElements, event.previousIndex, event.currentIndex);
        const previousIndex: number = event.previousIndex + indexRelativity;
        const currentIndex: number = event.currentIndex + indexRelativity;
        // this.onDragAndDrop.emit(event);
        this.onDragAndDrop.emit({previousIndex, currentIndex});
        this.removeNotUserSelectHtml();
    }

    setColumnSort(columnName: string, sortable?: number) {
        const column = this.Columns.find((c: DataGridColumn) => c.Name === columnName);
        this.headerSortClick(column, sortable);
    }

    public dataBinding() {
        this.onDataBinding.emit(this);
    }

    /**
     * Data property
     * */

    /**
     * Data methods
     */
    getDataRows(): any[] {
        return this._dataSource || [];
    }

    getDataRow(id: any): any {
        return ((this.Rows || []).find(x => x.Data[this.KeyField] === id) || {Data: null}).Data;
    }

    getDataRowIndex(index: number): any {
        return (this.Rows || [])[index].Data;
    }

    addDataRow(Item: any): void {
        this.getDataRows().push(Item);
    }

    updateDataRow(Item: any, dataItem: any): void {
        const keys = Object.keys(Item);
        for (const key in keys) {
            Item[keys[key]] = dataItem[keys[key]];
        }
    }

    deleteRow(Id: any) {
        const index = this._dataSource.indexOf(this.getDataRow(Id), 0);
        if (index >= 0) {
            delete this.linkDataRows[Id];
            this._dataSource.splice(index, 1);
            this.Rows.splice(index, 1);
            this.cdRef.detectChanges();
        }
    }

    getSelectDataRows(): any[] {
        if (this.SelectionRow && this.SelectionRow.mode === SelectionRowMode.Multiple) {
            if (this.virtualScroll && this.virtualScroll.items) {
                return this.virtualScroll.items.filter((item: any) => this.SelectedRows[item[this.KeyField]] != null);
            }
        }
        return [];
    }

    /**
     * Data Source End
     */
}
