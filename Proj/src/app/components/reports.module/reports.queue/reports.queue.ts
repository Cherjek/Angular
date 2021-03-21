import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as Filters from '../../../shared/rom-forms/filters.panel';
import { Utils } from '../../../core';
import DateConvert = Utils.DateConvert;
import * as ConstNamespace from '../../../common/Constants';
import Constants = ConstNamespace.Common.Constants;
import * as DateRangeModule from '../../../common/models/Filter/DateRange';
import DateRange = DateRangeModule.Common.Models.Filter.DateRange;
import * as LookupModule from '../../../common/models/Filter/Lookup';
import Lookup = LookupModule.Common.Models.Filter.Lookup;
import LookupField = LookupModule.Common.Models.Filter.LookupField;
import * as GridControls from '../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import DataColumnType = GridControls.DataColumnType;
import { ReportQueueService } from '../../../services/reports.module/ReportQueue.service';
import { DownloadFileService } from '../../../services/reports.module/DownloadFile.service';
import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';
import { GlobalValues, PermissionCheck, DataGridCurrentItemService } from '../../../core';
import { IReportsQueueData } from '../../../services/reports.module/interfaces/ireports-queue-data.interface';
import { Timer, ITimer } from 'src/app/common/models/Timer/Timer';
import { SelectionRowMode } from '../../../controls/DataGrid';

@Component({
    selector: 'app-report.queue',
    templateUrl: './reports.queue.html',
    styleUrls: ['./reports.queue.css']
})
export class ReportsQueueComponent extends Timer implements ITimer, OnInit, OnDestroy {
    @ViewChild('Ro5FiltersPanel', { static: true }) ro5FiltersPanel: Filters.FiltersPanelComponent;
    @ViewChild('FilterIntervalControlTemplate', { static: true }) filterIntervalControlTemplate: TemplateRef<any>;
    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    @ViewChild('CellTemplateLinkToDetail', { static: true }) private cellTemplateLinkToDetail: TemplateRef<any>;
    @ViewChild('CellTemplateProgressTooltip', { static: true }) private cellTemplateProgressTooltip: TemplateRef<any>;
    @ViewChild('CellTemplateDownload', { static: true }) private cellTemplateDownload: TemplateRef<any>;
    private actionButtonRepeatIsValid = new Map<string, boolean>();
    public errorsContentValidationForms: any[] = [];
    private filterRequest: any = {Users: 1};
    public NameStatusError: string = Constants.NAME_STATUS_ERROR;
    public loadingContentPanel: boolean;
    private _itemIsNotFinished = false;
    public get itemIsNotFinished() {
        return this._itemIsNotFinished;
    }
    public set itemIsNotFinished(value) {
        this._itemIsNotFinished = value;
    }
    templateDateIntervalData: any[] = [
        {
            Date: new DateRange(),
            DisplayText: AppLocalization.LatestEntries,
            FieldName: 'NotSet'
        },
        {
            Date: new DateRange(new Date(), new Date()),
            DisplayText: AppLocalization.CreationDate,
            FieldName: 'CreateDate'
        },
        {
            Date: new DateRange(new Date(), new Date()),
            DisplayText: AppLocalization.StartingDate,
            FieldName: 'StartDate'
        },
        {
            Date: new DateRange(new Date(), new Date()),
            DisplayText: AppLocalization.EndDate,
            FieldName: 'EndDate'
        }
    ];
    Menu: NavigateItem[] = Constants.NAVIGATION_MENU_QUEUE;

    constructor(private dataSource: ReportQueueService,
                private downloadFileServ: DownloadFileService,
                private router: Router,
                public permissionCheck: PermissionCheck,
                public dataGridCurrentItemService: DataGridCurrentItemService) {
                    super();
                }

    ngOnInit() {
        this.createFilterData();
        this.dataGrid.KeyField = 'Id';
        this.dataGrid.SelectionRowMode = SelectionRowMode.Multiple;
        this.dataGrid.Columns = [
            {
                Name: 'StatusName',
                Caption: AppLocalization.Status,
                CellTemplate: this.cellTemplateProgressTooltip,
                Width: 120
            },
            {
                Name: 'Name',
                Caption: AppLocalization.Report,
                CellTemplate: this.cellTemplateLinkToDetail,
                disableTextWrap: true,
            },
            {
                Name: 'CreateDate',
                Caption: AppLocalization.Create,
                DataType: DataColumnType.DateTime,
                Sortable: -1
            },
            {
                Name: 'StartDate',
                Caption: AppLocalization.Start,
                DataType: DataColumnType.DateTime
            },
            {
                Name: 'EndDate',
                Caption: AppLocalization.End,
                DataType: DataColumnType.DateTime
            },
            {
                Name: 'Download',
                CellTemplate: this.cellTemplateDownload
            },
            {
                Name: 'UserName',
                Caption: AppLocalization.Initiator
            }
        ];
        this.dataGrid.ActionButtons = [
            {
                Name: 'Repeat',
                DisplayText: AppLocalization.TryAgain,
                IsValid: (data: IReportsQueueData) => {
                    if (this.actionButtonRepeatIsValid.has(data.Id)) {
                        return this.actionButtonRepeatIsValid.get(data.Id);
                    }
                    this.actionButtonRepeatIsValid.set(data.Id, false);
                    const user = GlobalValues.Instance.userApp.UserName;
                    if (data.UserName !== user) {
                        this.permissionCheck.checkAuthorization('DR_OTHER_USER_RESTART').toPromise().then(
                            (response) => {
                                this.actionButtonRepeatIsValid.set(data.Id, response && data.IsEndState);
                                return this.actionButtonRepeatIsValid.get(data.Id);
                            },
                            () => {
                                return this.actionButtonRepeatIsValid.get(data.Id);
                            }
                        );
                    } else {
                        this.actionButtonRepeatIsValid.set(data.Id, data.IsEndState);
                        return this.actionButtonRepeatIsValid.get(data.Id);
                    }
                }
            },
            {
                Name: 'Cancel',
                DisplayText: AppLocalization.Cancel,
                IsValid: (data: IReportsQueueData) => {
                    return data.IsEndState === false && data.Status !== 'Canceling';
                }
            }
        ];
    }

    ngOnDestroy() {
        this.stopTimer();
    }

    loadData(): void {
        // отключаем, если работает таймер
        this.stopTimer();
        this.dataSource
            .get(this.filterRequest)
            .subscribe(
                (data) => {
                    this.loadingContentPanel = false;
                    this.loadContent(data);
                    // включаем таймер после загрузки, 10s
                    this.startTimer();
                },
                (error) => {
                    this.loadingContentPanel = false;
                    this.errorsContentValidationForms.push(error);
                }
            );
    }

    loadContent(data: any): void {
        this.dataGrid.DataSource = data;
    }

    private preloadData(): void {
        this.loadingContentPanel = true;
        this.loadData();
    }

    // для template только для этой формы
    onItemDateIntervalClick(filter: any, index: number) {
        for (let i = 0; i < filter.Data.length; i++) {
            filter.Data[i].IsCheck = index === i;
        }
    }

    createFilterData() {
        const filterItems: any[] = [];
        filterItems.push({
            Caption: AppLocalization.Interval,
            Name: 'Date',
            Template: this.filterIntervalControlTemplate,
            IsValuesSingle: true,
            DataSource: new Lookup(this.templateDateIntervalData, new LookupField('DisplayText', 'FieldName'))
        });
        // Lookup - данные списком, массив, данные в списках могут выбираться по checkbox или radiobutton,
        // соответственно регулируются параметром - IsValuesSingle = true, это радиобаттон, по дефолту чекбокс
        // получение данных из сервиса - http://192.168.202.200/dvb/api/v1/validation/dictionary/statuses
        filterItems.push({
            Caption: AppLocalization.Status,
            Name: 'Status',
            DataSource: new Lookup('statuses', new LookupField('Value', 'Key'))
        });
        // данные задаются напрямую
        const filters = [{Key: 1, Value: AppLocalization.MyTurn}];
        filterItems.push({
            Caption: AppLocalization.Initiator,
            Name: 'Users',
            IsValuesSingle: true,
            DataSource: new Lookup(filters, new LookupField('Value', 'Key'))
        });
        this.accessDataGridInit().pipe(
            finalize(() => {
                this.ro5FiltersPanel.createFilters(filterItems);
            })
        ).subscribe(
            (response: any[]) => {
                if (response[0]) {
                    filters.push({Key: 2, Value: AppLocalization.MineAndOthers});
                }
            }
        );
    }

    private accessDataGridInit(): Observable<boolean[]> {
        const checkAccess = [
            'DR_OTHER_USER_QUEUE'
        ];
        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[]) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });
        return forkJoin<boolean>(obsrvs);
    }

    private setDefaultStateDateInterval() {
        for (let i = 0; i < this.templateDateIntervalData.length; i++) {
            this.templateDateIntervalData[i].IsCheck = i === 0;
        }
    }

    private onClearFilter(filter: any): void {
        if (filter.Caption === AppLocalization.Interval) {
            this.setDefaultStateDateInterval();
        }
    }

    private onClearAllFilter(): void {
        this.setDefaultStateDateInterval();
    }

    public onApplyFilter(filter: any): void {
        this.loadingContentPanel = true;
        const keys = Object.keys(filter);
        const request = {};
        for (let key in keys) {
            key = keys[key];
            if (key === 'Users') {
                filter[key].forEach((data: any) => {
                    request[key] = data.Key;
                });
            } else if (key === 'Date') {
                filter[key].forEach((data: any) => {
                    request[data.FieldName] = [];
                    if (typeof data.Date.FromDate === 'string') {
                        data.Date.FromDate = new Date(data.Date.FromDate);
                    }
                    if (typeof data.Date.ToDate === 'string') {
                        data.Date.ToDate = new Date(data.Date.ToDate);
                    }
                    request[data.FieldName].push(DateConvert.Instance.getTimeOffset(data.Date.FromDate));
                    request[data.FieldName].push(DateConvert.Instance.getTimeOffset(data.Date.ToDate));
                });
            } else {
                filter[key].forEach((data: any) => {
                    request[key] = request[key] || [];
                    request[key].push(data.Key);
                });
            }
        }
        this.filterRequest = request;
        this.preloadData();
    }

    onGridDataBinding(el: any) {
    }

    onActionButtonClicked(button: any) {
        let promise: Promise<any>;
        if (button.action === 'Repeat') {
            promise = this.dataSource.repeatAnalyze(button.item.Id);
        }
        if (button.action === 'Cancel') {
            promise = this.dataSource.cancelAnalyze(button.item.Id);
            button.item.StatusName = AppLocalization.Canceled; // ROM-359
            button.item.Status = 'Canceling'; // ROM-405
        }
        if (promise) {
            promise.then(
                (response: any) => {
                    this.loadData();
                },
                (error: any) => {
                    this.errorsContentValidationForms.push(error);
                }
            );
        }
    }

    private upload(data: any) {
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(data.blob, data.fileName);
      } else {
          const downloadLink = document.createElement('a');
          const url = window.URL.createObjectURL(data.blob);
          downloadLink.href = url;
          downloadLink.download = data.fileName;

          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
      }
    }

    downloadFile(key: string) {
        this.downloadFileServ.loadFile(key).subscribe(
            (data: any) => {
                this.upload(data);
            },
            (error: any) => {
                this.errorsContentValidationForms.push(error);
            }
        );
    }

    downloadSelected(files: any[]) {
      this.downloadFileServ.loadFiles((files || []).map(f => f.Id)).subscribe(
        (data: any) => {
            this.upload(data);
        },
        (error: any) => {
            this.errorsContentValidationForms.push(error);
        }
      );
    }

    public onNavSelectChanged(route: any) {
        this.router.navigate([route.url]);
    }

    rowClicked() {
        this.itemIsNotFinished = this.dataGrid.getSelectDataRows().some(row => !row.IsFinished);
    }

    cancelRows(validForCancelList: any[]) {
        let promises: Promise<any>;
        if (validForCancelList.length) {
            promises = Promise.all(validForCancelList.map(obj => {
                obj.StatusName = AppLocalization.Canceled;
                obj.Status = 'Canceling';
                return this.dataSource.cancelAnalyze(obj.Id);
            }));
        }
        if (promises) {
            promises.then(
                (response: any) => {
                    this.loadData();
                },
                (error: any) => {
                    this.errorsContentValidationForms.push(error);
                }
            );
        }
    }
}
