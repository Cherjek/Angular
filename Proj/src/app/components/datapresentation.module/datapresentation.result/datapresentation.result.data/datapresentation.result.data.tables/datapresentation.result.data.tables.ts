import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, Input, Output, OnInit, OnChanges, ViewChild, TemplateRef, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { finalize } from "rxjs/operators";

import * as ControlGrid from '../../../../../controls/DataGrid';
import DataGrid = ControlGrid.DataGrid;
import DataGridColumn = ControlGrid.DataGridColumn;
import DGDataColumnType = ControlGrid.DataColumnType;
import DGDataColumnTextAlign = ControlGrid.DataColumnTextAlign;
import DGSelectionRowMode = ControlGrid.SelectionRowMode;
import DGActionButtom = ControlGrid.ActionButtons;
import DGActionButtonConfirmSettings = ControlGrid.ActionButtonConfirmSettings;
import DGEditable = ControlGrid.Editable;
import DGEditableMode = ControlGrid.EditableMode;
import DGTypeParsingColumn = ControlGrid.TypeParsingColumn;

import { ExportXlsxOptions, ExportColInfo } from '../../../../../controls/Services/ExportToXlsx';

import { ObjectTagsValueService } from '../../../../../services/datapresentation.module/ObjectTagsValue.service';
import { ValueTable } from '../../../../../services/datapresentation.module/Models/ValueTable';

import * as Constants from '../../../../../common/Constants';

import { PermissionCheck } from "../../../../../core";

declare var $: any;

@Component({
    selector: 'frame-datapresentation-result-data-tables',
    templateUrl: 'datapresentation.result.data.tables.html',
    styleUrls: ['datapresentation.result.data.tables.css']
})

export class DatapresentationResultDataTablesComponent implements OnInit, OnDestroy {
    accessDataSub$: Subscription;
    private dataSource: any[];
    @Input()
    get DataSource() {
      return this.dataSource;
    }
    set DataSource(data: any[]) {
       if (data && data.length) {
        this.dataGrid.initDataGrid();
       }
       this.dataSource = data;
    }
    @Input() objectTagsValueService: ObjectTagsValueService;    

    @Output() onRefreshData = new EventEmitter<any>();

    readonly DGSelectionRowMode = DGSelectionRowMode;
    readonly DGDataColumnTextAlign = DGDataColumnTextAlign;
    readonly DGEditable = new DGEditable();

    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    @ViewChild('cellUnit', { static: true }) cellUnit: TemplateRef<any>;
    @ViewChild('cellTag', { static: true }) cellTag: TemplateRef<any>;
    @ViewChild('cellValue', { static: true }) cellValue: TemplateRef<any>;

    public errorsContentForm: any[] = []; 
    public loadingContentPanel = false;

    constructor(public permissionCheck: PermissionCheck) {
    }

    ngOnInit() {
        this.initGrid();
    }

    ngOnDestroy() {
        if (this.accessDataSub$) {
            this.accessDataSub$.unsubscribe();
        }
    }

    private initGrid() {

        this.accessDataSub$ = this.accessDataGridInit().subscribe((results: boolean[]) => {

            this.dataGrid.Columns = [
                {
                    Name: "LogicDeviceDisplayText",
                    AggregateFieldName: ["UnitDisplayText"],
                    Caption: AppLocalization.Label32,
                    IsEdit: false,
                    CellTemplate: this.cellUnit
                },
                {
                    Name: "UnitDisplayText",
                    Visible: false,
                    IsExport: false
                },
                {
                    Name: "TagCode",
                    AggregateFieldName: ["TagName"],
                    Caption: AppLocalization.Tag,
                    IsEdit: false,
                    CellTemplate: this.cellTag
                },
                {
                    Name: "Datetime",
                    Caption: AppLocalization.Date,
                    IsEdit: false,
                    DataType: DGDataColumnType.DateTime,
                    Sortable: -1,
                    Width: 200
                },
                {
                    Name: "Value",
                    Caption: AppLocalization.Value,
                    //DP_EDIT_VALUE ACCESS
                    IsEdit: results[1],
                    CellTemplate: this.cellValue,
                    TextAlign: DGDataColumnTextAlign.Right,
                    TypeParsing: new DGTypeParsingColumn((item: any) => {
                        return item.ValueType === 'ValueFloat' ? DGDataColumnType.Decimal :
                            item.ValueType === 'ValueBool' ? DGDataColumnType.Boolean :
                                item.ValueType === 'ValueInt' ? DGDataColumnType.Number :
                                    item.ValueType === 'ValueData' ? DGDataColumnType.String : 'ValueData';
                    }),
                    Width: 120
                },
                {
                    Name: "TagUnitName",
                    Caption: "",
                    IsEdit: false,
                    Width: 150
                }
            ];
            this.dataGrid.ActionButtons = [
                new DGActionButtom("CopyToBuffer", AppLocalization.CopyToClipboard)
            ];
            //DP_DELETE_VALUE ACCESS
            if (results[0]) {

                this.dataGrid.ActionButtons = [...this.dataGrid.ActionButtons,
                    new DGActionButtom("DeleteValue", AppLocalization.DeleteValue, new DGActionButtonConfirmSettings(AppLocalization.YoureSureYouWantToDeleteYourChosenValue, AppLocalization.Delete))
                ];

            }

            this.dataGrid.Editable = new DGEditable();
            let exportOptions = new ExportXlsxOptions();
            exportOptions.fileName = AppLocalization.Label69;
            exportOptions.exportColsInfo = [
                {
                    name: "A",
                    wpx: 250
                },
                {
                    name: "B",
                    wpx: 300,
                    style: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } }
                },
                {
                    name: "C",
                    type: "d",
                    z: Constants.Common.Constants.DATE_TIME_FMT,
                    wpx: 150
                },
                {
                    name: "D",
                    //type: "n",
                    //z: "#,###0.000",                
                    wpx: 150
                },
                {
                    name: "E",
                    wpx: 200
                }
            ];
            this.dataGrid.ExportXlsxOptions = exportOptions;
            
        });
        
    }

    private accessDataGridInit(): Observable<boolean[]> {

        const checkAccess = [
            'DP_DELETE_VALUE',
            'DP_EDIT_VALUE'
        ];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[]) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        return forkJoin<boolean>(obsrvs);
    }

    deleteValues(rows: any[]) {
        this.loadingContentPanel = true;
        let valueTable: any[] = [];
        rows.forEach((data: any) => {
            let val = new ValueTable();
            val.Datetime = data.Datetime;
            val.IdDeviceTag = data.TagId;
            val[data.ValueType] = data.Value;
            valueTable.push(val);
        });
        this.objectTagsValueService
            .post(valueTable, "delete")
            .then(() => {
                this.onRefreshData.emit(rows);
                this.loadingContentPanel = false;
            },
            (error: any) => {
                this.errorsContentForm.push(error);
                this.loadingContentPanel = false;
            });
    }

    deleteAllValues() {
        let rows = this.dataGrid.getSelectDataRows();
        this.deleteValues(rows);
    }

    onActionButtonClicked(button: any) {
        if (button.action === "DeleteValue") {
            this.deleteValues([button.item]);
        }
        else if (button.action === "CopyToBuffer") {
            this.dataGrid.copyToClipboard(button.item);
        }
    }

    onGridEditingCellApply(cell: any) {

        cell.data.IdDeviceTag = cell.data.TagId;
        if (cell.value != null) {
            cell.isAsyncUpdateValue = true;

            cell.data[cell.data.ValueType] = cell.value;

            this.objectTagsValueService.post([cell.data])
                .then(() => {
                    cell.data[cell.column.Name] = cell.value;
                    cell.isAsyncUpdateValue = false;
                },
                    (error) => this.errorsContentForm.push(error));
        }            
    }    
}