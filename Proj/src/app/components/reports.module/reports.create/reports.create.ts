import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ReportDirsService } from '../../../services/reports.module/ReportDirs.service';
import { EquipmentService } from '../../../services/common/Equipment.service';

import { ListView, ListItem } from '../../../controls/ListView/ListView';

import { ReportCreateService } from '../../../services/reports.module/ReportCreate.service';
import { ReportDirItemsService } from '../../../services/reports.module/ReportDirItems.service';
import { CurrentUserService } from '../../../services/authorization.module/current.user.service';

import * as Localization from "../../../common/Localization";
import Locale = Localization.Common.Localization;

import { TreeListCheckedService } from '../../../shared/rom-forms/treeList.checked.panel';
import { Utils, GlobalValues } from '../../../core';

declare var $: any;

const JobNameField = "JobName";
const DirIdField = "Id";

@Component({
    selector: 'app-report.create',
    templateUrl: './reports.create.html',
    styleUrls: ['./reports.create.css']
})
export class ReportsCreateComponent implements OnInit, OnDestroy {

    private urlParamsSubscribe: Subscription;
    private urlKeyParams: any;

    public JobObjects: any[];
    public Nodes: any[];
    public DirObjects: any[] = [];
    public ReportObjects: any[] = [];
    public JobNameField = JobNameField;
    public DirIdField = DirIdField;

    public loadingRightPanel = true;
    public loadingContentPanel = false;
    public loadingFilterPanel = true;

    public jobObjectErrors: any[] = [];
    public errorsFilterPanel: any[] = [];
    public errorsContentPanel: any[] = [];

    public expandedRow: any = {
        expandedRowId: null,
        isExpanded: false
    }    

    public lastRowReportClick: any;
    private get isHierarchy() {
        return this.router.url.startsWith('/hierarchy');
    }
    public changeDetection: string;
    public basketHeaderMenu: string[];

    @ViewChild('contentListView', { static: true }) contentListView: ListView;
    @ViewChild('filterListView', { static: true }) filterListView: ListView;

    constructor(private router: Router,
                private activateRoute: ActivatedRoute,
                private directoriesService: ReportDirsService,
                private reportsService: ReportDirItemsService,
                private dsEquipment: EquipmentService,
                private reportCreateService: ReportCreateService,
                private currentUserService: CurrentUserService,
                public treeListCheckedService: TreeListCheckedService,
                public utilsTree: Utils.UtilsTree) {

        this.urlParamsSubscribe = this.activateRoute.queryParams.subscribe(
            params => {
                this.urlKeyParams = params;
            },
            error => {
                this.errorsContentPanel.push(error);
            }
        );
    }

    ngOnInit() {
        if (this.isHierarchy) {
            this.basketHeaderMenu = [GlobalValues.Instance.hierarchyApp.NodesName, AppLocalization.Label32];
        }

        this.directoriesService.get()
            .subscribe(
            (data: any) => {
                this.DirObjects = data;
                this.loadingFilterPanel = false;
                if (data && data.length) {
                    this.getReportList((<any[]>data)[0][DirIdField]);
                }
            },
            (error) => {
                this.loadingFilterPanel = false;
                this.errorsFilterPanel.push(error);
            }
            );

        const errorFnc = (error: any) => {
            this.loadingRightPanel = false;
            this.jobObjectErrors.push(error);
        }
        if (this.isHierarchy) {
            const idHierarchy = this.activateRoute.snapshot.params.id;
            const key = this.activateRoute.snapshot.queryParams.key;
            this.dsEquipment.getForReport(idHierarchy, key)
                .pipe(
                    finalize(() => this.loadingRightPanel = false)
                )
                .subscribe(
                    (data: any) => this.Nodes = data,
                    (error: any) => errorFnc(error)
                );
        } else {
            this.dsEquipment.get(this.urlKeyParams)
                .pipe(
                    finalize(() => this.loadingRightPanel = false)
                )
                .subscribe(
                    (data: any) => this.JobObjects = data,
                    (error: any) => errorFnc(error)
                );
        }
    }

    ngOnDestroy() {
        this.urlParamsSubscribe.unsubscribe();
    }

    back2Objects() {
        GlobalValues.Instance.Page.backwardButton.navigate();
    }

    onDirClick(item: any) {
        this.getReportList(item.Data[DirIdField]);
    }

    private getReportList(dirId: number) {
        this.loadingContentPanel = true;
        this.reportsService.get(dirId)
            .subscribe(
            (data) => {
                this.currentUserService
                    .getPermissionReports(this.urlKeyParams.key)
                    .subscribe(
                        (reportIds: any) => {
                            
                            data = (<any[]>data).filter((d: any) => {
                                return reportIds.find((rId: number) => rId === d.IdReport) != null;
                            });

                            this.loadingContentPanel = false;
                            this.typeCorrectionForRendering(data);
                        },
                        (error: any) => {
                            this.loadingContentPanel = false;
                            this.errorsContentPanel.push(error);
                        }
                    );
            },
            (error) => {
                this.loadingContentPanel = false;
                this.errorsContentPanel.push(error);
            }
            );
    }

    typeCorrectionForRendering(data: any) {
        data.forEach((item: any) => {

            item[JobNameField] = item['ReportTypeName'];

            item.Settings.forEach((sett: any) => {
                if (sett.EditorType === 'IntervalDate' || sett.EditorType === 'IntervalDateTime') {
                    sett.Value = {};
                    sett.Value.fromDate = undefined;
                    sett.Value.toDate = undefined;
                } else if (sett.EditorType === 'Date' || sett.EditorType === 'Datetime' || sett.EditorType === 'Month') {
                    sett.Value = undefined;
                }
            });
        });
        this.ReportObjects = data;
    }

    formReport(item: any) {
        let units: any[] = [];
        const setting: any = {};

        if (this.isHierarchy) {
            setting.ByHierarchy = true;
            setting.IdHierarchy = this.activateRoute.snapshot.params.id;
            units = this.Nodes
              .map(node => 
                node.LogicDevices
              )
              .reduce((list1, list2) => [...list1, ...list2])
              .sort((x: any, y: any) => x.Position - y.Position)
              .map((ld: any) => ld.Id);
        } else {
            (this.JobObjects || []).forEach(data => {
                units.push(data.IdLogicDevice);
            });
        }

        this.errorsContentPanel = [];

        if (!item.Data[JobNameField]) this.errorsContentPanel.push(Locale.Form.ReportErrorName);
        if (!units.length) this.jobObjectErrors.push(Locale.Form.ErrorObjectsCount);

        if (this.errorsContentPanel.length === 0 && this.jobObjectErrors.length === 0) {

            this.loadingContentPanel = true;

            item.Data.SettingsEx = item.Data.Settings;
            delete item.Data.Settings;

            const request = {
                JobName: item.Data[JobNameField],
                LogicDeviceIds: units,
                ReportTypeViewEx: item.Data
            }
            if (setting.ByHierarchy) {
                request['ByHierarchy'] = setting.ByHierarchy;
                request['IdHierarchy'] = setting.IdHierarchy;
            }
            
            const formData: FormData = new FormData();
            (item.Data.SettingsEx||[]).forEach(((setting: any) => {
                if (setting.Value !== null) {
                    if (setting.EditorType == "File") {
                        let file: File = setting.Value;
                        formData.append("Settings." + setting.Code, file, file.name);

                        setting.Value = null;
                    }

                    if (setting.Value != null) setting.Value = JSON.stringify(setting.Value);                    
                }
            }));            
            let keys = Object.keys(request);
            keys.forEach((key: string) => {
                formData.append(key, JSON.stringify(request[key]));
            });            

            this.reportCreateService
                .postFormData(formData)
                .then((res: any) => {
                    this.router.navigate(['/reports/queue']);
                }, (error: any) => {
                    this.loadingContentPanel = false;
                    this.errorsContentPanel.push(error);
                });
        }
    }

    monthClick(sett: any, val: any) {
        sett.Value = val;
    }

    singleSelectVals: any[] = [
        {
            IsCheck: true,
            DisplayText: 'SingleSelect1',
            FieldName: "SingleSelect1"
        },
        {
            IsCheck: false,
            DisplayText: 'SingleSelect2',
            FieldName: "SingleSelect2"
        },
        {
            IsCheck: false,
            DisplayText: 'SingleSelect3',
            FieldName: "SingleSelect3"
        }
    ];

    multiSelectVals: any[] = [
        {
            IsCheck: false,
            DisplayText: 'MultiSelect1',
            FieldName: "MultiSelect1"
        },
        {
            IsCheck: false,
            DisplayText: 'MultiSelect2',
            FieldName: "MultiSelect2"
        },
        {
            IsCheck: false,
            DisplayText: 'MultiSelect3',
            FieldName: "MultiSelect3"
        }
    ];

    onMultiSelectClick(sett: any, ind: number) {
        this.multiSelectVals[ind].IsCheck = !this.multiSelectVals[ind].IsCheck;
        sett.Value = this.multiSelectVals;
    }

    onSingleSelectClick(sett: any, ind: number) {
        this.singleSelectVals.forEach((item: any, i: number) => {
            item.IsCheck = (i === ind);
        });
        sett.Value = this.singleSelectVals;
    }

    private showReportDetails(id: string) {
        $("#" + id).collapse('show');
    }
    private hideReportDetails(id: string) {
        $("#" + id).collapse('hide');
    }

    onRowExpanded(item: any, id: string) {

        if (this.expandedRow.expandedRowId != id) this.expandedRow.isExpanded = false;
        this.expandedRow.expandedRowId = id;

        if (!this.expandedRow.isExpanded) {
            this.showReportDetails(id);
        }
        else {
            this.hideReportDetails(id);
            setTimeout(() => this.lastRowReportClick.IsFocused = false, 100);
        }
        this.expandedRow.isExpanded = !this.expandedRow.isExpanded;
    }

    onReportFavClick(item: any, event: any) {
        $(event.target).tooltip('dispose');

        item.Data.IsFavorite = !item.Data.IsFavorite;

        if (item.Data.IsFavorite) this.directoriesService.addToFavorites(item.Data[this.contentListView.KeyField]);
        else this.directoriesService.deleteFromFavorites(item.Data[this.contentListView.KeyField]);
    }

    onRemoveJobObjects(items: any) {
        this.JobObjects = items;

        if (items == null || !items.length) this.back2Objects();
    }

    private getDataSourceClone(data: any[]): any[] {
        return [...data].map(d => {
            const newNode = {...d};
            newNode.LogicDevices = [...d.LogicDevices];
            return newNode;
        });
    }

    removeListItems(items: any) {
        if (items.length) {
          this.Nodes = this.Nodes || [];
          const template = this.getDataSourceClone(this.Nodes);
          this.utilsTree.excludeTree(items, template, 'Id', 'LogicDevices');
          this.Nodes = template;
          this.changeDetection = (new Date()).getTime().toString();
        } else {
          this.Nodes = [];
        }

        if (this.Nodes == null || !this.Nodes.length) {
            this.back2Objects();
        }
    }
}
