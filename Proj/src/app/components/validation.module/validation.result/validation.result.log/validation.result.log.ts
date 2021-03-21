import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

declare var $: any;

import { ValidationResultLogsService } from '../../../../services/validation.module/ValidationResultLogs.service';

import * as Controls from '../../../../controls/DataGrid';
import DataGrid = Controls.DataGrid;
import DataGridColumn = Controls.DataGridColumn;
import DataColumnType = Controls.DataColumnType;

import { NavigateItem } from "../../../../common/models/Navigate/NavigateItem";

@Component({
    selector: 'frame-validation-result-log',
    templateUrl: 'validation.result.log.html',
    styleUrls: ['validation.result.log.less']
})

export class ValidationResultLogComponent implements OnInit, OnDestroy {

    constructor(
        private activateRoute: ActivatedRoute,
        private dsLogs: ValidationResultLogsService) {

        this.subscription = activateRoute.parent.params.subscribe(params => this.jobId = params['id']);
    }

    public loadingContentPanel: boolean = true;
    public errorsContentValidationForms: any[] = [];
    private subscription: Subscription;
    private jobId: string;    

    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    @ViewChild('cellMessageType', { static: true }) cellMessageType: TemplateRef<any>;
    @ViewChild('cellDatetime', { static: true }) cellDatetime: TemplateRef<any>;

    public navItems: NavigateItem[] = [
        { name: AppLocalization.AllEvents, code: 'allEvents' },
        { name: AppLocalization.OnlyMistakes, code: 'onlyErrors', isVisible: false }
    ];

    ngOnInit() {

        this.dataGrid.KeyField = "Id";
        this.dataGrid.Columns = [
            {
                Name: "Datetime",
                Caption: AppLocalization.Date,
                //DataType: DataColumnType.DateTime,
                CellTemplate: this.cellDatetime,
                Width: 200,
                Sortable: -1
            },
            {
                Name: "MessageType",
                Caption: "",
                CellTemplate: this.cellMessageType,
                Width: 20
            },
            {
                Name: "Message",
                Caption: AppLocalization.Description
            }
        ];
        this.loadData();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private loadData(): void {
        this.dsLogs.get(this.jobId)
            .subscribe(
                (data: any[]) => {
                    let errors = data.filter((x: any) => x.MessageType === "ERROR");
                    if (errors.length) this.navItems[1].isVisible = true;

                    this.loadingContentPanel = false;
                    this.dataGrid.DataSource = data;
                },
                (error) => {
                    this.loadingContentPanel = false;
                    this.errorsContentValidationForms = [error];
                }
            );
    }

    public navClick(navItem: NavigateItem) {
        if (navItem.code == 'onlyErrors') {
            this.dataGrid.Filter = { "MessageType": "ERROR" };
        } else {
            this.dataGrid.Filter = undefined;
        }

        this.dataGrid.inputSearchFocus();
    }
}
