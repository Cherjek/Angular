import { AppLocalization } from 'src/app/common/LocaleRes';
import { Observable, of, Subscription } from 'rxjs';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import * as GridControls from '../../../../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import DGDataColumnType = GridControls.DataColumnType;
import * as CommonConstant from '../../../../../../common/Constants';
import { MainQueueFilterContainerService } from 'src/app/services/tariff-calculator/main/filters/main-queue-filter-container.service';
import { TariffCalculatorMainFilterService } from 'src/app/services/tariff-calculator/main/filters/tariff-calculator-main-filter.service';
import { TariffMainTaskService } from 'src/app/services/taiff-calculation/export-import-queue/Task/TariffMainTask.service';
import { finalize } from 'rxjs/operators';
import { TariffCalculatorTask } from 'src/app/services/tariff-calculator/main/models/tariff-calculator-task';
import { ITimer, Timer } from 'src/app/common/models/Timer/Timer';

@Component({
  selector: 'rom-main-queue',
  templateUrl: './main-queue.component.html',
  styleUrls: ['./main-queue.component.less'],
  providers: [TariffMainTaskService]
})
export class MainQueueComponent extends Timer
  implements ITimer, OnInit, OnDestroy {
  public errors: any[] = [];
  public loadingContent: boolean;
  private filterKey: string; // фильтр примененный к гриду
  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  public exportTemplateMenu: any[];
  public importTemplateMenu: any[];
  @ViewChild('progressStatusTemplate', { static: true })
  private progressStatusTemplate: TemplateRef<any>;
  @ViewChild('cellTemplateLinkToDetail', { static: true })
  private cellTemplateLinkToDetail: TemplateRef<any>;
  @ViewChild('cellTemplateFile', { static: true })
  private cellTemplateFile: TemplateRef<any>;
  @ViewChild('cellUserName', { static: true })
  private cellUserName: TemplateRef<any>;
  loadingValidTemplatePanel = false;
  public NameStatusError: string =
    CommonConstant.Common.Constants.NAME_STATUS_ERROR;
  filter$: Subscription;

  constructor(
    public filtersContainerService: MainQueueFilterContainerService,
    private tariffCalcMainFilterService: TariffCalculatorMainFilterService,
    private tariffMainTaskService: TariffMainTaskService
  ) {
    super();
  }

  ngOnInit() {
    this.preloadData();
  }

  ngOnDestroy() {
    this.filter$.unsubscribe();
    this.stopTimer();
  }

  private preloadData(): void {
    this.loadingContent = true;
    this.loadData();
  }

  public loadData() {
    // отключаем, если работает таймер
    this.stopTimer();
    this.filter$ = this.filtersContainerService.filtersService
      .getRecords(this.filterKey)
      .subscribe(
        (tasks: any[]) => {
          this.initDG(
            tasks.map((x) => {
              x.Name =
                (x.Name || AppLocalization.WithoutName);
              return x;
            })
          );
          this.loadingContent = false;
          // включаем таймер после загрузки, 10s
          this.startTimer();
        },
        (error: any) => {
          this.loadingContent = false;
          this.errors.push(error);
        }
      );
  }

  private initDG(tasks: any[]) {
    this.dataGrid.initDataGrid();
    this.dataGrid.KeyField = 'Id';

    this.dataGrid.ActionButtons = [
      {
        Name: 'Abort',
        DisplayText: AppLocalization.Cancel,
        IsValid: (data: any) => {
          return (data['State'].Code === 'NotYetExecuted' || 
            data['State'].Code === 'Executing');
        }
      }, {
        Name: 'Repeat',
        DisplayText: AppLocalization.TryAgain,
        IsValid: (data: any) => {
          return (data['State'].Code === 'Aborted' || 
            data['State'].Code === 'Failed' ||
            data['State'].Code === 'Success');
        }
      }
    ];

    this.dataGrid.Columns = [
      {
        Name: 'State',
        Caption: AppLocalization.Status,
        AggregateFieldName: ['Name'],
        CellTemplate: this.progressStatusTemplate,
        Width: 150,
      },
      {
        Name: 'Name',
        Caption: AppLocalization.Name,
        CellTemplate: this.cellTemplateLinkToDetail,
      },
      {
        Name: 'CreateDate',
        Caption: AppLocalization.Create,
        DataType: DGDataColumnType.DateTime,
        Sortable: -1,
      },
      {
        Name: 'StartDate',
        Caption: AppLocalization.Start,
        DataType: DGDataColumnType.DateTime,
      },
      {
        Name: 'FinishDate',
        Caption: AppLocalization.End,
        DataType: DGDataColumnType.DateTime,
      },
      {
        Name: 'UpdateDate',
        Caption: AppLocalization.Updated,
        DataType: DGDataColumnType.DateTime,
      },
      {
        Name: 'Files',
        Caption: AppLocalization.File,
        CellTemplate: this.cellTemplateFile,
      },
      {
        Name: 'User',
        Caption: AppLocalization.Initiator,
        AggregateFieldName: ['Name'],
        CellTemplate: this.cellUserName,
        Width: 150,
      },
    ];
    this.dataGrid.DataSource = tasks;
  }

  public onActionButtonClicked(button: any) {
    let promise: Promise<Object>;
    if (button.action === 'Abort') {
      promise = this.tariffCalcMainFilterService.abortTask(button.item.Id);
    } else if (button.action === 'Repeat') {
      promise = this.tariffCalcMainFilterService.repeatTask(button.item.Id);
    }
    this.loadingContent = true;
    promise
      .then((result: any) => {
        if (result === 0) {
          this.loadData();
        }
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  public onApplyFilter(guid: string): void {
    this.filterKey = guid;
    this.preloadData();
  }

  downloadFile(files: any[]) {
    const upload = (data: any) => {
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
    };
    this.loadingContent = true;
    this.tariffMainTaskService
      .getImportFiles(files.map((x) => x.Path))
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (files) => {
          upload(files);
        },
        () => {
          this.errors = [AppLocalization.NoFileFound];
        }
      );
  }
}
