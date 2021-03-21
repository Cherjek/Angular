import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { finalize } from "rxjs/operators";
import { PermissionCheck } from "../../../../core";

import { ValidationResultDataService } from '../../../../services/validation.module/ValidationResultData.service';
import { ValidationResultService } from '../../../../services/validation.module/ValidationResult.service';

import { DetailsRowComponent, DetailsRow } from "../../../../controls/ListComponentCommon/DetailsRow/DetailsRow";
import { ValResultMainDetailComponent } from "./details.row/val.result.main.detail";

import { FiltersPanelComponent } from "../../../../shared/rom-forms/filters.panel";
import * as LookupModule from '../../../../common/models/Filter/Lookup';
import Lookup = LookupModule.Common.Models.Filter.Lookup;
import LookupField = LookupModule.Common.Models.Filter.LookupField;
import * as ControlGrid from '../../../../controls/DataGrid';
import DataGrid = ControlGrid.DataGrid;
import DataGridColumn = ControlGrid.DataGridColumn;
import DGDataColumnType = ControlGrid.DataColumnType;
import DGSelectionRowMode = ControlGrid.SelectionRowMode;

import { ExportToXlsx, ExportXlsxOptions } from '../../../../controls/Services/ExportToXlsx';

import * as Models from '../../../../services/validation.module/Models/DataValidationCreateJobSetting';
import Issue = Models.Services.ValidationModule.Models.Issue;

import * as Constants from '../../../../common/Constants';

declare var $: any;

@Component({
    selector: 'frame-validation-result-main',
    templateUrl: 'validation.result.main.html',
    styleUrls: ['validation.result.main.css']
})

export class ValidationResultMainComponent implements OnInit, OnDestroy {

    /**
     * MODELS
     */
    Job: any = {
        Result: {}
    };
    readonly DisplayIssueText: string = "Name"; 

    DGSelectionRowMode = DGSelectionRowMode;

    private jobId: string;
    private jobTags: any;
    public solveMethods: any[] = [];
    private subscription: Subscription;
    constructor(
        private router: Router,
        private activateRoute: ActivatedRoute,
        private dsData: ValidationResultDataService,
        private validationService: ValidationResultService,
        private permissionCheck: PermissionCheck) {

        this.subscription = activateRoute.parent.params.subscribe(params => this.jobId = params['id']);
    }
    ngOnInit() {

        this.dataGrid.KeyField = "Id";
        this.dataGrid.Columns = [
            {
                Name: "LogicDeviceName",
                AggregateFieldName: ["UnitName"],
                Caption: AppLocalization.Label32,
                CellTemplate: this.colLogicDevice,
                Width: 290
            },
            {
                Name: "UnitName",
                Visible: false,
                IsExport: false
            },
            {
                Name: "Tags",
                AggregateFieldName: ["Code", "Name"],
                Caption: AppLocalization.Tag,
                CellTemplate: this.cellTagsName,
                ColTemplate: this.colTagsName,
                Width: 480
            },
            {
                Name: "Tags1",
                AggregateFieldName: ["Value"],
                Caption: AppLocalization.Reading,
                Visible: false
            },
            {
                Name: "Tags2",
                AggregateFieldName: ["UnitName"],
                Caption: "",
                Visible: false
            },
            {
                Name: "DateStart",
                Caption: AppLocalization.Start,
                DataType: DGDataColumnType.DateTime,
                Sortable: -1
            },
            {
                Name: "DateEnd",
                Caption: AppLocalization.End,
                DataType: DGDataColumnType.DateTime
            }
        ];

        let exportOptions = new ExportXlsxOptions();
        exportOptions.fileName = AppLocalization.Label89;
        exportOptions.exportColsInfo = [
            {
                name: "A",
                wpx: 350
            },
            {
                name: "B",
                wpx: 300,
                style: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } }
            },
            {
                name: "C",
                type: "n",
                z: "#,###0.000",
                wpx: 200
            },
            {
                name: "D",
                wpx: 200
            },
            {
                name: "E",
                type: "d",
                z: Constants.Common.Constants.DATE_TIME_FMT,
                wpx: 150
            },
            {
                name: "F",
                type: "d",
                z: Constants.Common.Constants.DATE_TIME_FMT,
                wpx: 150
            }
        ];
        this.dataGrid.ExportXlsxOptions = exportOptions;

        this.loadData();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        //this.querySubscription.unsubscribe();
    }

    @ViewChild('Ro5FiltersPanel', { static: false }) ro5FiltersPanel: FiltersPanelComponent;
    @ViewChild('colLogicDevice', { static: true }) colLogicDevice: TemplateRef<any>;
    @ViewChild('colTagsName', { static: true }) colTagsName: TemplateRef<any>;
    @ViewChild('cellTagsName', { static: true }) cellTagsName: TemplateRef<any>;
    @ViewChild('colTagsValue', { static: false }) colTagsValue: TemplateRef<any>;
    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;

    //forms property
    public loadingContentPanel: boolean = true;
    public loadingFilterPanel: boolean = true;

    public errorsFilterValidationForms: any[] = [];
    public errorsContentValidationForms: any[] = [];

    public selectedIssue: any;
    private fromDate: any;
    private toDate: any;
    public issuesNotFound: boolean;
    
    private loadData(): void {
        this.dsData.get(this.jobId)
            .subscribe(
                    (data) => this.dataBindContent(data).then((issues: any) => {
                        this.loadingFilterPanel = false;
                        if ((issues || []).length) this.viewIssueResult(issues[0]);
                        else {
                            this.loadingContentPanel = false;
                            this.issuesNotFound = true;
                        }
                }, (error) => { }),
                (error) => {
                    this.loadingFilterPanel = false;
                    this.errorsFilterValidationForms.push(error);
                }
            );
    }
    private dataBindContent(data: any[]): Promise<any> {
        return new Promise((resolve, reject) => {

            this.Job = data;

            let issues: Issue[] = this.Job.Issues;

            resolve(issues);
        });
    }

    private viewIssueResult(issue: any) {
        this.selectedIssue = issue;
        setTimeout(() => {
            this.createFilterTags();
            this.loadIssueSolveMethods();
            this.selectIssue();
        }, 300);        
    }

    private loadIssueSolveMethods() {
        if (this.selectedIssue) {
            this.validationService.getIssueSolveMethods(this.selectedIssue.Id)
                .subscribe(
                    (solveMethods: any[]) => {
                        this.solveMethods = solveMethods;
                    },
                    (error) => this.errorsContentValidationForms.push(error)
                );
        }
    }

    private createFilterTags() {
        if (this.ro5FiltersPanel) {
            let filterItems: any[] = [];
            filterItems.push({
                Caption: AppLocalization.Tags,
                Name: "Tags",
                DataSource: this.getSelectedIssueTags()
            });
            this.ro5FiltersPanel.createFilters(filterItems);
        }
    }

    private getSelectedIssueTags() {
        let tags = (this.selectedIssue || {}).Tags || [];
        tags.forEach((tag: any) => {
            if ((tag["Name"] || "").indexOf(tag["Code"]) < 0) {
                tag["Name"] = tag["Code"] + '&nbsp;' + '<span class="text-info-additional">' + tag["Name"] + '</span>';
            }
        });
        return new Lookup((this.selectedIssue || {}).Tags, new LookupField("Name", "Code"));
    }
    private loadResult(): void {
        if (this.selectedIssue) {
            this.loadingContentPanel = true;

            let tags = this.jobTags;

            this.validationService.get({ jobId: this.jobId, issueId: this.selectedIssue.Id, tags: (tags||[]) })
                .subscribe(
                    (data: any[]) => this.dataBindResult(data).then(() => {
                        this.loadingContentPanel = false;
                    }, (error) => { }),
                    (error) => {
                        this.loadingContentPanel = false;
                        this.errorsContentValidationForms.push(error);
                    }
                );
        }
    }

    private dataBindResult(data: any[]): Promise<any> {
        return new Promise((resolve, reject) => {

            //this.accessDataGridInit().subscribe((results: boolean[]) => {

                //if (results[0]) {

                    const dr = new DetailsRow();
                    dr.components = [
                        new DetailsRowComponent(AppLocalization.TransitionToDataView, ValResultMainDetailComponent)
                    ];
                    this.dataGrid.DetailRow = dr;
                //}

                this.dataGrid.DataSource = data;
                
                resolve();
            //});
            
        });
    }

    private accessDataGridInit(): Observable<boolean[]> {

        const checkAccess = [
            'DP_ALLOW'
        ];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[]) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        return forkJoin<boolean>(obsrvs);
    }
    
    onIssueItemClick(item: any): void {
        this.viewIssueResult(item);
    }
    onApplyFilter(filter: any): void {
        let tags: any[] = [];
        for (let t in filter.Tags) {
            tags.push(filter.Tags[t].Code);
        }
        this.jobTags = tags;

        this.loadResult();
    }
    private selectIssue(): void {
        this.loadResult();
    }
    public fixErrorGap(issueSolveId: any) {
        this.loadingContentPanel = true;

        this.validationService.fixIssueError(this.jobId, this.selectedIssue.Id, issueSolveId)
            .then(() => {
                this.loadingContentPanel = false;
                this.router.navigate(['validation/queue']/*, { relativeTo: this.activateRoute }*/);
            },
            (error: any) => {
                this.loadingContentPanel = false;
                this.errorsContentValidationForms.push(error);
            });
    }
}
