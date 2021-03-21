import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionCheck } from 'src/app/core';
import { DataGrid, DataColumnType } from 'src/app/controls/DataGrid';
import { RequestsQueueService } from 'src/app/services/requests.module/RequestsQueue.service';
import Constants = ConstNamespace.Common.Constants;
import * as ConstNamespace from 'src/app/common/Constants';
import * as Filters from 'src/app/shared/rom-forms/filters.panel';
import { DataQueryFiltersContainerService } from 'src/app/services/data-query/filters-queue/DataQueryFiltersContainer.service';
import { DataQueryAddFiltersService } from 'src/app/services/data-query/filters-queue/DataQueryAddFilters.service';
import { DataQueryDefFiltersService } from 'src/app/services/data-query/filters-queue/DataQueryDefFilters.service';
import { RequestsQueueFiltersService } from 'src/app/services/requests.module/RequestsQueueFilters.service';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { Router } from '@angular/router';
import { Timer, ITimer } from 'src/app/common/models/Timer/Timer';

@Component({
  selector: 'rom-requests-queue',
  templateUrl: './requests-queue.component.html',
  styleUrls: ['./requests-queue.component.css'],
  providers: [
    DataQueryFiltersContainerService,
      DataQueryFiltersContainerService,
    DataQueryFiltersContainerService,
    DataQueryAddFiltersService,
      DataQueryAddFiltersService,
    DataQueryAddFiltersService,
    DataQueryDefFiltersService,
    RequestsQueueFiltersService
  ]
})
export class RequestsQueueComponent extends Timer
  implements ITimer, OnInit, OnDestroy {
  public loadingContentPanel = true;
  public errorsContentValidationForms: any[] = [];
  @ViewChild('Ro5FiltersPanel', { static: true })
  ro5FiltersPanel: Filters.FiltersPanelComponent;
  @ViewChild('FilterIntervalControlTemplate', { static: true })
  filterIntervalControlTemplate: TemplateRef<any>;
  @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
  @ViewChild('CellTemplateLinkToDetail', { static: true })
  private cellTemplateLinkToDetail: TemplateRef<any>;
  @ViewChild('CellTemplateProgressTooltip', { static: true })
  private cellTemplateProgressTooltip: TemplateRef<any>;
  public NameStatusError: string = Constants.NAME_STATUS_ERROR;
  public filterKey: string;
  Menu: NavigateItem[] = Constants.NAVIGATION_MENU_QUEUE;
  dataLoad$: Subscription;
  constructor(
    public router: Router,
    public requestsQueueFiltersService: RequestsQueueFiltersService,
    public dataQueryFiltersContainerService: DataQueryFiltersContainerService,
    public permissionCheck: PermissionCheck,
    private dataSource: RequestsQueueService
  ) {
    super();
  }

  ngOnInit() {
    this.dataGrid.KeyField = 'Id';
    this.dataGrid.Columns = [
      {
        Name: 'StatusName',
        Caption: AppLocalization.Status,
        CellTemplate: this.cellTemplateProgressTooltip,
        Width: 180
      },
      {
        Name: 'Name',
        Caption: AppLocalization.Name,
        CellTemplate: this.cellTemplateLinkToDetail,
        disableTextWrap: true
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
        Name: 'FinishDate',
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
        Name: 'Cancel',
        DisplayText: AppLocalization.Cancel,
        IsValid: (data: any) => {
            return data.State.Code === 'NotYetExecuted' || data.State.Code === 'Executing';
        }
      }
    ];

    this.preloadData();
  }

  ngOnDestroy() {
    this.stopTimer();
    this.dataLoad$.unsubscribe();
  }

  /**
   *
   * @param filter
   * Применяет указанный фильтр к таблице.
   */
  onApplyFilter(guid: string): void {
    this.filterKey = guid;
    this.preloadData();
  }

  onGridDataBinding(): void {}

  /**
   *
   * @param filter выбранный фильтр
   * @param index индекс выбранного фильтра
   * Фильтр по датам интервал
   */
  onItemDateIntervalClick(filter: any, index: number) {
    for (let i = 0; i < filter.Data.length; i++) {
      filter.Data[i].IsCheck = index === i;
    }
  }

  onActionButtonClicked(button: any) {
    this.loadingContentPanel = true;
    if (button.action === 'Cancel') {
      this.dataSource.abortTask(button.item.Id);

      button.item.State.Name = AppLocalization.Canceled; // ROM-359
      button.item.State.Code = 'Canceling';
    }
  }

  onNavSelectChanged(route: any) {
    this.router.navigate([route.url]);
  }

  /**
   * Показать значок загрузчика и перезагрузить данные
   */
  private preloadData(): void {
    this.loadingContentPanel = true;
    this.loadData();
  }

  /**
   * остановка таймера и загрузки данных
   */
  loadData(): void {
    // отключаем, если работает таймер
    this.stopTimer();

    this.dataLoad$ = this.requestsQueueFiltersService
      .get(this.filterKey)
      .subscribe(
        (data: any[]) => {
          (data || []).forEach(d => (d.StatusName = (d.State || {}).Name));

          this.loadingContentPanel = false;
          this.loadContent(data);

          // включаем таймер после загрузки, 10s
          this.startTimer();
        },
        error => {
          this.loadingContentPanel = false;
          this.errorsContentValidationForms.push(error);
        }
      );
  }

  /**
   *
   * @param data данные таблицы
   * Загрузка данных для таблицы
   */
  private loadContent(data: any[]) {
    this.dataGrid.DataSource = data;
  }
}
