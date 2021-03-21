import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ValidationJobService } from '../../../services/validation.module/ValidationJob.service';
import * as Filters from "../../../shared/rom-forms/filters.panel";
import { Utils } from '../../../core';
import DateConvert = Utils.DateConvert;
import * as ConstNamespace from '../../../common/Constants';
import Constants = ConstNamespace.Common.Constants;
import * as GridControls from '../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import DataColumnType = GridControls.DataColumnType;
import * as DateRangeModule from '../../../common/models/Filter/DateRange';
import DateRange = DateRangeModule.Common.Models.Filter.DateRange;
import * as LookupModule from '../../../common/models/Filter/Lookup';
import Lookup = LookupModule.Common.Models.Filter.Lookup;
import LookupField = LookupModule.Common.Models.Filter.LookupField;
import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';
import { GlobalValues, PermissionCheck, DataGridCurrentItemService } from '../../../core';
import { IValidationQueueData } from '../../../services/validation.module/interfaces/ivalidation-queue-data.interface';
import { Timer, ITimer } from 'src/app/common/models/Timer/Timer';

@Component({
    selector: 'frame-validation-queue',
    templateUrl: 'validation-queue.component.html',
    styleUrls: ['validation-queue.component.less']
})
export class ValidationQueueComponent extends Timer implements ITimer, OnInit, OnDestroy {
    @ViewChild('CellTemplateLinkToDetail', { static: true }) private cellTemplateLinkToDetail: TemplateRef<any>;
    @ViewChild('CellTemplateProgressTooltip', { static: true }) private cellTemplateProgressTooltip: TemplateRef<any>;
    @ViewChild('Ro5FiltersPanel', { static: true }) ro5FiltersPanel: Filters.FiltersPanelComponent;
    @ViewChild('FilterIntervalControlTemplate', { static: true }) filterIntervalControlTemplate: TemplateRef<any>;
    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    public loadingContentPanel = true;
    public errorsContentValidationForms: any[] = [];
    private filterRequest: any = {Users: 1};
    public NameStatusError: string = Constants.NAME_STATUS_ERROR;
    public Menu: NavigateItem[] = Constants.NAVIGATION_MENU_QUEUE;
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
    private actionButtonRepeatIsValid = new Map<string, boolean>();

    constructor(private dataSource: ValidationJobService,
                private router: Router,
                public permissionCheck: PermissionCheck,
                public dataGridCurrentItemService: DataGridCurrentItemService) {
                    super();
                }

    ngOnInit() {
        this.dataGrid.KeyField = 'Id';
        this.dataGrid.Columns = [
            {
                Name: 'StatusName',
                Caption: AppLocalization.Status,
                CellTemplate: this.cellTemplateProgressTooltip,
                Width: 120
            },
            {
                Name: 'Name',
                Caption: AppLocalization.Name,
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
                Name: 'UserName',
                Caption: AppLocalization.Initiator
            }
        ];
        this.dataGrid.ActionButtons = [
            {
                Name: 'Repeat',
                DisplayText: AppLocalization.TryAgain,
                IsValid: (data: IValidationQueueData) => {
                    if (this.actionButtonRepeatIsValid.has(data.Id)) {
                        return this.actionButtonRepeatIsValid.get(data.Id);
                    }
                    this.actionButtonRepeatIsValid.set(data.Id, false);
                    const user = GlobalValues.Instance.userApp.UserName;
                    if (data.UserName !== user) {
                        this.permissionCheck.checkAuthorization('DA_OTHER_USER_RESTART').toPromise().then(
                            (response) => {
                                this.actionButtonRepeatIsValid.set(data.Id, response && data.IsEndState);
                                return  this.actionButtonRepeatIsValid.get(data.Id);
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
                IsValid: (data: IValidationQueueData) => {
                    return data.IsEndState === false && data.Status !== 'Canceling';
                }
            }
        ];

        this.createFilterData();
    }

    public ngOnDestroy() {
        this.stopTimer();
    }

    private preloadData(): void {
        this.loadingContentPanel = true;
        this.loadData();
    }

    loadData(): void {

        // отключаем, если работает таймер
        this.stopTimer();

        this.dataSource.get(this.filterRequest).subscribe(
                (data: any[]) => {
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

    private loadContent(data: any[]) {
        this.dataGrid.DataSource = data;
    }

    onActionButtonClicked(button: any): void {
        let promise: Promise<any>;
        if (button.action === 'Repeat') {
            promise = this.dataSource.repeatAnalyze(button.item.Id);
        }
        if (button.action === 'Cancel') {
            promise = this.dataSource.cancelAnalyze(button.item.Id);

            button.item.StatusName = AppLocalization.Canceled; // ROM-359
            button.item.Status = 'Canceling';
        }
        if (promise) {
            promise.then((response: HttpResponse<any>) => {
                    /**
                     *RESPONSE ПОЧЕМУ-ТО ВСЕГДА NULL!!!
                     */
                    if (0 === 0) {
                        /**
                         * ВРЕМЕННОЕ РЕШЕНИЕ, ДЛЯ ОДНОЙ ЗАПИСИ НЕ НУЖНО ОБНОВЛЯТЬ ВСЮ ТАБЛИЦУ!!!
                         */
                        this.loadData();
                    }
                },
                function (error: any) {
                    this.errorsContentValidationForms.push(error);
                }
            );
        }
    }

    // для template только для этой формы
    onItemDateIntervalClick(filter: any, index: number) {
        for (let i = 0; i < filter.Data.length; i++) {
            filter.Data[i].IsCheck = index === i;
        }
    }

    createFilterData(): void {
        const filterItems: any[] = [];
        // Фильтр диапозон дат с шаблоном
        filterItems.push({
            Caption: AppLocalization.Interval,
            Name: 'Date',
            Template: this.filterIntervalControlTemplate,
            IsValuesSingle: true,
            DataSource: new Lookup(this.templateDateIntervalData, new LookupField('DisplayText', 'FieldName'))
        });

        // Lookup - данные списком, массив, данные в списках могут выбираться по checkbox или radiobutton, соответственно регулируются параметром - IsValuesSingle = true, это радиобаттон, по дефолту чекбокс
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
            'DA_OTHER_USER_QUEUE'
        ];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[]) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        return forkJoin<boolean>(obsrvs);
    }

    onGridDataBinding(dataGrid: any): void {
        if (this.ro5FiltersPanel) {
            // создаем фильтр, в onGridDataBinding не обязательно, тут нужен если мы хотим
            // из грида для колонок сформировать фильтр
        }
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

    public onNavSelectChanged(route: any) {
        this.router.navigate([route.url]);
    }
}
