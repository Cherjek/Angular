import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  TemplateRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { DataGrid, DataColumnType } from 'src/app/controls/DataGrid';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { IDetailsComponent } from 'src/app/controls/ListComponentCommon/DetailsRow/IDetailsComponent';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IDatabaseTaskLogRecord } from 'src/app/services/data-query';
import { ScheduleResultService } from 'src/app/services/schedules.module';
import { ITimer, Timer } from 'src/app/common/models/Timer/Timer';

@Component({
  selector: 'rom-schedule-result-log',
  templateUrl: './schedule-result-log.component.html',
  styleUrls: ['./schedule-result-log.component.less']
})
export class ScheduleResultLogComponent extends Timer implements ITimer, OnInit, OnDestroy, IDetailsComponent {
  @Input() parentKey: any;
  @Input() params: any;
  data: IDatabaseTaskLogRecord;

  @Output() onLoadEnded = new EventEmitter<boolean>();
  /**
   * Ссылка на GridTable
   */
  @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
  /**
   * Ссылка на datetime ячейки в сетке таблицы
   */
  @ViewChild('cellDatetime', { static: true }) cellDatetime: TemplateRef<any>;
  /**
   * Ссылка на класса messagetype ячейки в сетке таблицы
   */
  @ViewChild('cellMessageType', { static: true })
  cellMessageType: TemplateRef<any>;
  /**
   * Идентификатор выбранного оборудования
   */
  deviceTypeId: number;
  /**
   * Подписка для router
   */
  schedule$: any;
  /**
   * Массив для сбора ошибок для отображения в виджете ошибка
   */
  public errorsContentValidationForms: any[] = [];
  /**
   * Логическое отображение или скрытие значка загрузки
   */
  public loadingContentPanel = true;
  /**
   * Nav таблицы заголовки
   */
  public navItems: NavigateItem[] = [
    { name: AppLocalization.AllEvents, code: 'allEvents' },
    { name: AppLocalization.OnlyMistakes, code: 'onlyErrors', isVisible: false }
  ];

  scheduleId: number;
  journalId: number;

  data$: Subscription;
  get hideHeader() {
    return this.router.url.includes('steps');
  }
  
  constructor(
    private scheduleResultService: ScheduleResultService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.scheduleId = this.activatedRoute.parent.snapshot.params.id;
    this.journalId = this.activatedRoute.parent.snapshot.params.idjournal;
  }

  ngOnInit() {
    this.dataGrid.KeyField = 'Id';

    this.initGrid();
    this.loadData();
  }

  private initGrid() {
    const dataObj = [
      {
        Name: 'DateTime',
        Caption: AppLocalization.Date,
        DataType: DataColumnType.DateTime,
        CellTemplate: this.cellDatetime,
        Width: 200,
        Sortable: -1
      },
      {
        Name: 'LogLevel',
        Caption: '',
        CellTemplate: this.cellMessageType,
        Width: 20,
        AggregateFieldName: ['Code']
      },
      {
        Name: 'Text',
        Caption: AppLocalization.Description
      }
    ];
    this.dataGrid.Columns = [];
    this.dataGrid.Columns = dataObj;
  }

  ngOnDestroy() {
    this.stopTimer();
    this.data$.unsubscribe();
  }

  /**
   *
   * @param navItem объект, содержащий типа нажал кнопку nav
   * Метод для фильтрации таблицы в зависимости от типа нажал кнопку nav
   */
  public navClick(navItem: NavigateItem) {
    if (navItem.code === 'onlyErrors') {
      /*
      LogLevel | Code : Error
        значит
      { "LogLevel": {"Code": "Error"} }
    */
      this.dataGrid.Filter = { 'LogLevel|Code': 'Error' };
    } else {
      this.dataGrid.Filter = undefined;
    }

    this.dataGrid.inputSearchFocus();
  }
  /**
   * Метод для загрузки данных для запроса-результат
   */
  public loadData(): void {
    this.stopTimer();
    this.data$ = this.loadLogData()
      .pipe(finalize(() => (this.loadingContentPanel = false)))
      .subscribe(
        (data: IDatabaseTaskLogRecord[]) => {
          const errors = (data || []).filter((x: any) => (x.LogLevel || {}).Code === 'Error');
          if (errors.length) {
            this.navItems[1].isVisible = true;
          }

          this.dataGrid.DataSource = data;

          this.onLoadEnded.emit(true);
          this.startTimer();
        },
        error => {
          this.errorsContentValidationForms.push(error);
        }
      );
  }

  private loadLogData() {
      return this.scheduleResultService.getJournalLog(this.scheduleId, this.journalId);
  }

}
