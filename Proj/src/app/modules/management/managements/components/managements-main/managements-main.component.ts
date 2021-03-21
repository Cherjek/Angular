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
import Constants = ConstNamespace.Common.Constants;
import * as ConstNamespace from 'src/app/common/Constants';
import * as Filters from 'src/app/shared/rom-forms/filters.panel';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { Router } from '@angular/router';
import { ManagementsMainService } from 'src/app/services/managements.module/managements-main.service';
import { ManagementResultService } from 'src/app/services/managements.module/Result/management-result.service';
import { CommandDataQueryAddFiltersService } from 'src/app/services/managements.module/filters-queue/CommandDataQueryAddFilters.service';
import { CommandDataQueryDefFiltersService } from 'src/app/services/managements.module/filters-queue/CommandDataQueryDefFilters.service';
import { CommandDataQueryFiltersContainerService } from 'src/app/services/managements.module/filters-queue/CommandDataQueryFiltersContainer.service';
import { Timer, ITimer } from 'src/app/common/models/Timer/Timer';

@Component({
  selector: 'rom-managements-main',
  templateUrl: './managements-main.component.html',
  styleUrls: ['./managements-main.component.less'],
  providers: [
    CommandDataQueryFiltersContainerService,
    CommandDataQueryAddFiltersService,
    CommandDataQueryDefFiltersService,
    ManagementResultService
  ]
})
export class ManagementsMainComponent extends Timer
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
    public commandDataQueryFiltersContainerService: CommandDataQueryFiltersContainerService,
    public permissionCheck: PermissionCheck,
    private dataSource: ManagementsMainService,
    private managementResultService: ManagementResultService ) {
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
          return (
            data.State.Code === 'NotYetExecuted' ||
            data.State.Code === 'Executing'
          );
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

  onGridDataBinding(dataGrid: any): void {}

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
      this.managementResultService.abortCommand(button.item.Id);

      button.item.State.Name = AppLocalization.Canceled;
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

    this.dataLoad$ = this.dataSource.get(this.filterKey).subscribe(
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
