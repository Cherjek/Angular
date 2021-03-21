import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DataGrid, DataColumnType } from 'src/app/controls/DataGrid';
import Constants = ConstNamespace.Common.Constants;
import * as ConstNamespace from 'src/app/common/Constants';
import * as Filters from 'src/app/shared/rom-forms/filters.panel';
import { ActivatedRoute } from '@angular/router';
import { ScheduleResultService } from 'src/app/services/schedules.module';

@Component({
  selector: 'rom-schedule-result-steps',
  templateUrl: './schedule-result-steps.component.html',
  styleUrls: ['./schedule-result-steps.component.css']
})
export class ScheduleResultStepsComponent implements OnInit, OnDestroy {
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

  subscription$: Subscription;
  @ViewChild('gridName', { static: true })
  gridName: any;

  scheduleId: number;
  journalId: number;
  constructor(
    private scheduleResultService: ScheduleResultService,
    private activatedRoute: ActivatedRoute
  ) {
    this.scheduleId = this.activatedRoute.parent.snapshot.params.id;
    this.journalId = this.activatedRoute.parent.snapshot.params.idjournal;
  }

  ngOnInit() {
    this.dataGrid.KeyField = 'Id';
    this.dataGrid.Columns = [
      {
        Name: 'State',
        Caption: AppLocalization.Status,
        CellTemplate: this.cellTemplateProgressTooltip,
        Width: 180,
        AggregateFieldName: ['Name']
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
      // {
      //   Name: 'UserName',
      //   Caption: AppLocalization.Initiator
      // }
    ];
    this.loadData();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  /**
   * остановка таймера и загрузки данных
   */
  private loadData(): void {
    this.subscription$ = this.scheduleResultService
      .getJournalSteps(this.scheduleId, this.journalId)
      .subscribe(
        (data: any[]) => {
          this.loadingContentPanel = false;
          this.loadContent(data);
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
