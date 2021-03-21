import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import {
  ScheduleJournalService,
  IScheduleJournalRecord
} from 'src/app/services/schedules.module';
import { IDeviceType } from 'src/app/services/data-query';
import { DataGrid, DataColumnType } from 'src/app/controls/DataGrid';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import Constants = ConstNamespace.Common.Constants;
import * as ConstNamespace from 'src/app/common/Constants';
import { Subscription } from 'rxjs';
import { Timer, ITimer } from 'src/app/common/models/Timer/Timer';
@Component({
  selector: 'rom-schedule-card-log',
  templateUrl: './schedule-card-log.component.html',
  styleUrls: ['./schedule-card-log.component.css']
})
export class ScheduleCardLogComponent extends Timer implements ITimer, OnInit, OnDestroy {
  public scheduleId: number;
  public deviceTypes: IDeviceType[];
  public errorsContentValidationForms: any[] = [];
  public NameStatusError: string = Constants.NAME_STATUS_ERROR;
  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  dataLoad$: Subscription;
  loadingContentPanel = true;
  @ViewChild('CellTemplateProgressTooltip', { static: true })
  private cellTemplateProgressTooltip: TemplateRef<any>;
  @ViewChild('CellTemplateLinkToDetail', { static: true })
  private cellTemplateLinkToDetail: TemplateRef<any>;

  constructor(
    private schedulesService: ScheduleJournalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.scheduleId = this.activatedRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.loadData(() => this.initDG());
  }

  ngOnDestroy() {
    this.stopTimer();
    this.dataLoad$.unsubscribe();
  }

  loadData(callback?: any) {
    // отключаем, если работает таймер
    this.stopTimer();

    this.dataLoad$ = this.schedulesService
      .getJournal(this.scheduleId)
      .pipe(finalize(() => (this.loadingContentPanel = false)))
      .subscribe(
        (deviceTypes: IScheduleJournalRecord[]) => {
          this.deviceTypes = deviceTypes;
          if (callback) {
            callback();
          }

          this.dataGrid.DataSource = this.deviceTypes;

          // включаем таймер после загрузки, 10s
          this.startTimer();
        },
        error => {
          this.errorsContentValidationForms = [error];
        }
      );
  }

  private initDG() {
    this.dataGrid.initDataGrid();

    this.dataGrid.KeyField = 'Id';
    this.dataGrid.Columns = [
      {
        Name: 'State',
        Caption: AppLocalization.Status,
        CellTemplate: this.cellTemplateProgressTooltip,
        Width: 120
      },
      {
        // Name: 'Name',
        // Caption: AppLocalization.Name,
        CellTemplate: this.cellTemplateLinkToDetail,
        Width: 100
        // disableTextWrap: true
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
    //   {
    //     Name: 'UserName',
    //     Caption: AppLocalization.Initiator
    //   }
    ];
  }
}
