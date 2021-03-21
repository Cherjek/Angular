import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as GridControls from '../../../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import SelectionRowMode = GridControls.SelectionRowMode;
import DGActionButton = GridControls.ActionButtons;
import DGDataColumnType = GridControls.DataColumnType;
import DGActionButtonConfirmSettings = GridControls.ActionButtonConfirmSettings;
import * as DateRangeModule from '../../../../../common/models/Filter/DateRange';
import DateRange = DateRangeModule.Common.Models.Filter.DateRange;
import { Observable, Subscription, forkJoin } from 'rxjs';
import { finalize } from "rxjs/operators";
import { PermissionCheck } from "../../../../../core";
import * as CommonConstant from "../../../../../common/Constants";
import { ExportImportQueueFilterContainerService } from 'src/app/services/taiff-calculation/export-import-queue/Filters/ExportImportQueueFilterContainer.service';
import { ContextButtonItem } from 'src/app/controls/ContextButton/ContextButtonItem';
import { DetailsRow, DetailsRowComponent } from 'src/app/controls/ListComponentCommon/DetailsRow/DetailsRow';
import { LogComponent } from '../containers/log/log.component';
import { SettingsComponent } from '../containers/settings/settings.component';
import { Task } from 'src/app/services/taiff-calculation/export-import-queue/Models/Task';
import { ExportImportService } from 'src/app/services/taiff-calculation/export-import-queue/export-import.service';
import { Timer, ITimer } from 'src/app/common/models/Timer/Timer';

@Component({
  selector: 'export-import-queue-component',
  templateUrl: './export-import-queue.component.html',
  styleUrls: ['./export-import-queue.component.less'],
})
export class ExportImportQueueComponent extends Timer
  implements ITimer, OnInit, OnDestroy {
  public errors: any[] = [];
  public loadingContent: boolean;
  public loadingTemplate: boolean;
  private filterKey: string; // фильтр примененный к гриду
  private DGSelectionRowMode = SelectionRowMode;
  // @ViewChild('frameFiltersCustompanel', { static: true })
  // private frameFiltersCustompanel: FiltersCustomPanelComponent;
  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  public exportTemplateMenu: any[];
  public importTemplateMenu: any[];
  @ViewChild('progressStatusTemplate', { static: true })
  private progressStatusTemplate: TemplateRef<any>;
  @ViewChild('cellTemplateFile', { static: true })
  private cellTemplateFile: TemplateRef<any>;
  @ViewChild('cellUserName', { static: true })
  private cellUserName: TemplateRef<any>;
  @ViewChild('nameTemplate', { static: true })
  private nameTemplate: TemplateRef<any>;
  public NameStatusError: string = CommonConstant.Common.Constants.NAME_STATUS_ERROR;

  constructor(
    public filtersContainerService: ExportImportQueueFilterContainerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private exportImportService: ExportImportService,
    private permissionCheck: PermissionCheck
  ) {
    super();
  }

  ngOnInit() {
    this.preloadData();
    this.loadTemplates();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private preloadData(): void {
    this.loadingContent = true;
    this.loadData();
  }

  public loadData() {
    // отключаем, если работает таймер
    this.stopTimer();
    this.filtersContainerService.filtersService
      .getRecords(this.filterKey)
      .subscribe(
        (data: Task[]) => {
          this.initDG(data.map(x => 
            { 
              x.Name = (x.Name || AppLocalization.WithoutName);  
              x['Type'] = x.IsExport ? AppLocalization.Export : AppLocalization.Import;
              return x; 
            }));

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

  private loadTemplates() {
    this.loadingTemplate = true;

    const observs = [
        this.exportImportService.getImportTemplates(),
        this.exportImportService.getExportTemplates()]
      forkJoin(observs)
      .subscribe(
        (data: [any[], any[]]) => {
          this.importTemplateMenu = data[0];
          this.exportTemplateMenu = data[1];

          this.loadingTemplate = false;          
        },
        (error: any) => {
          this.loadingTemplate = false;
        }
      );
  }

  private initDG(tasks: Task[]) {
    
    // this.accessDataGridInit().subscribe((results: boolean[]) => {
      this.dataGrid.initDataGrid();
      this.dataGrid.KeyField = 'Id';
      this.dataGrid.SelectionRowMode = this.DGSelectionRowMode.Multiple;

      // if (results[0]) {
        this.dataGrid.ActionButtons = [
          /*new DGActionButton(
            'Delete',
            AppLocalization.Delete,
            new DGActionButtonConfirmSettings(
              'Вы уверены, что хотите удалить выбранные записи?',
              AppLocalization.Delete
            )
          ),*/ {
            Name: 'Abort',
            DisplayText: AppLocalization.Cancel,
            IsValid: (data: Task) => {
              return (data['State'].Code === 'NotYetExecuted' || 
                data['State'].Code === 'Executing');
            }
          }, {
            Name: 'Repeat',
            DisplayText: AppLocalization.TryAgain,
            IsValid: (data: Task) => {
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
          CellTemplate: this.nameTemplate,
        },
        {
          Name: 'Type',
          Caption: AppLocalization.Type,
          Width: 100
        },
        {
          Name: 'CreateDate',
          Caption: AppLocalization.Create,
          DataType: DGDataColumnType.DateTime,
          Sortable: -1
        },
        {
          Name: 'StartDate',
          Caption: AppLocalization.Start,
          DataType: DGDataColumnType.DateTime
        },
        {
          Name: 'FinishDate',
          Caption: AppLocalization.End,
          DataType: DGDataColumnType.DateTime
        },
        {
          Name: 'UpdateDate',
          Caption: AppLocalization.Updated,
          DataType: DGDataColumnType.DateTime
        },
        {
          Name: 'Files',
          Caption: AppLocalization.File,
          CellTemplate: this.cellTemplateFile,
          Width: 100
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
    // });
  }
  private accessDataGridInit(): Observable<boolean[]> {
    const checkAccess = ['ES_EVENT_ALLOW_ACKNOWLEDGE'];

    const obsrvs: any[] = [];
    checkAccess.forEach((access: string | string[]) => {
      obsrvs.push(this.permissionCheck.checkAuthorization(access));
    });

    return forkJoin<boolean>(obsrvs);
  }

  public onActionButtonClicked(button: any) {
    let promise: Promise<Object>;
    /*if (button.action === 'Delete') {
      this.delete(button.item);
    } else*/ if (button.action === 'Abort') {
      promise = this.exportImportService.abortTask(button.item.Id);
      button.item.State.Name = AppLocalization.Canceled; // ROM-359
      button.item.State.Code = 'Canceling'; // ROM-405
    } else if (button.action === 'Repeat') {
      promise = this.exportImportService.repeatTask(button.item.Id);
    }
    promise
      .then((result: any) => {
        if (result === 0) {
          this.preloadData();
        }
      })
      .catch((error: any) => {
        this.errors = [error];
      });
  }

  public onApplyFilter(guid: string): void {
    this.filterKey = guid;
    this.preloadData();
  }

  public subMenuClick(type: number, id: number) {
    if (type === 1) {
      // export
      this.router.navigate(['tariff-calc/export-import/create/export']);
    } else if (type === 2) {
      // import
      if (id === -1) {
        this.router.navigate(['tariff-calc/export-import/create/import-files']);
      }
      else if (id === -2) {
        this.router.navigate(['tariff-calc/export-import/create/import']);
      }
    }
  }

  deleteFromTemplate(importExportType: number, id: number) {
    this.loadingContent = true;
    this.exportImportService.deleteTemplate(importExportType, id)
      .then(() => {
        if(importExportType === 1) {
          this.exportTemplateMenu = this.exportTemplateMenu.filter(x => x.Id !== id)
        } else {
          this.importTemplateMenu = this.importTemplateMenu.filter(x => x.Id !== id)
        }
        this.loadingContent = false;
      })
      .catch((error) => {
        this.errors = [error];
        this.loadingContent = false;
      })
  }

  setNewFromTemplate(importExportType: number, id: number) {
    this.router.navigate(
      [
        `tariff-calc/export-import/create/${
          importExportType === 1 ? 'export' : 'import'
        }`,
      ],
      {
        queryParams: {
          id,
        },
      }
    );
  }

  downloadFile(item: Task) {
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
    }
    this.loadingContent = true;
    this.exportImportService
      .getImportFiles(item.Files.map(x => x.Path))
      .pipe(
        finalize(() => this.loadingContent = false)
      )
      .subscribe((files) => {
        upload(files);
      }, (error: any) => {
        this.errors = [{ShortMessage: AppLocalization.NoFileFound}];
      });
  }
}
