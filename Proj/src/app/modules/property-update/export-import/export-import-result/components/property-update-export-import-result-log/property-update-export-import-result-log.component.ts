import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  TemplateRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DataGrid, DataColumnType } from 'src/app/controls/DataGrid';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { IDetailsComponent } from 'src/app/controls/ListComponentCommon/DetailsRow/IDetailsComponent';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  IDatabaseTaskLogRecord,
  DatabaseTaskLogRecord,
} from 'src/app/services/data-query';
import { PuExportImportService } from 'src/app/services/property-update/filters/pu-export-import.service';

@Component({
  selector: 'app-property-update-export-import-result-log',
  templateUrl: './property-update-export-import-result-log.component.html',
  styleUrls: ['./property-update-export-import-result-log.component.less'],
})
export class PropertyUpdateExportImportResultLogComponent
  implements OnInit, OnDestroy, IDetailsComponent {
  @Input() parentKey: any;
  @Input() params: any;
  data: DatabaseTaskLogRecord;

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
   * subscription для данных от бэкэнда
   */
  subscription$: any;
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
    { name: AppLocalization.OnlyMistakes, code: 'onlyErrors', isVisible: false },
  ];
  resultId: any;
  get hideHeader() {
    return this.router.url.includes('steps');
  }
  constructor(
    private exportImportService: PuExportImportService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.subscription$ = this.activatedRoute.parent.params.subscribe(
      (params) => (this.resultId = params.id)
    );
  }

  ngOnInit() {
    this.dataGrid.KeyField = 'Id';
    this.loadData();
  }

  private initGrid(data: IDatabaseTaskLogRecord[]) {
    const dataObj = [
      {
        Name: 'DateTime',
        Caption: AppLocalization.Date,
        DataType: DataColumnType.DateTime,
        CellTemplate: this.cellDatetime,
        Width: 200,
        Sortable: -1,
      },
      {
        Name: 'LogLevel',
        Caption: '',
        CellTemplate: this.cellMessageType,
        Width: 20,
        AggregateFieldName: ['Code'],
      },
      {
        Name: 'Text',
        Caption: AppLocalization.Description,
      },
    ];
    this.dataGrid.Columns = [];
    this.dataGrid.Columns = dataObj;
    this.dataGrid.DataSource = data;
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
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
  private loadData(): void {
    this.subscription$ = this.loadLogData()
      .pipe(
        finalize(() => {
          this.loadingContentPanel = false;
          this.onLoadEnded.emit(true);
        })
      )
      .subscribe(
        (data: IDatabaseTaskLogRecord[]) => {
          const errors = data.filter((x: any) => x.LogLevel.Code === 'Error');
          if (errors.length) {
            this.navItems[1].isVisible = true;
          }
          this.initGrid(data);
        },
        (error) => {
          this.errorsContentValidationForms.push(error);
        }
      );
  }

  private loadLogData(): Observable<
    IDatabaseTaskLogRecord | IDatabaseTaskLogRecord[]
  > {
    return this.exportImportService.getTaskLog(this.resultId);
  }
}
