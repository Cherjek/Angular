import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import * as GridControls from '../../../../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import SelectionRowMode = GridControls.SelectionRowMode;
import DGDataColumnType = GridControls.DataColumnType;
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as CommonConstant from '../../../../../../common/Constants';
import { Task } from 'src/app/services/taiff-calculation/export-import-queue/Models/Task';
import { Timer, ITimer } from 'src/app/common/models/Timer/Timer';
import { PUExportImportQueueFilterContainerService } from 'src/app/services/property-update/filters/pu-export-import-queue-filter-container.service';
import { PuExportImportService } from 'src/app/services/property-update/filters/pu-export-import.service';
import { keyUnits } from '../../../export-import-create/components/property-update-export-import-create/property-update-export-import-create.component';
import { GlobalValues } from 'src/app/core';
import { PropertyUpdateEntityTypesService } from 'src/app/services/property-update/entity/property-update-entity-types.service';
import { BaseTaskParameters } from 'src/app/services/property-update/Models/interfaces/BaseTaskParameters';
import { HierarchyParameters } from 'src/app/services/property-update/Models/interfaces/HierarchyParameters';
import { EntityType } from 'src/app/services/property-update/Models/EntityType';
import { Property } from 'src/app/services/property-update/Models/Property';
import { PropertyGroup } from 'src/app/services/property-update/Models/PropertyGroup';

@Component({
  selector: 'rom-property-update-export-import-queue',
  templateUrl: './property-update-export-import-queue.component.html',
  styleUrls: ['./property-update-export-import-queue.component.less'],
})
export class PropertyUpdateExportImportQueueComponent
  extends Timer
  implements ITimer, OnInit, OnDestroy {
  public errors: any[] = [];
  public loadingContent: boolean;
  private filterKey: string;
  private DGSelectionRowMode = SelectionRowMode;
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
  public NameStatusError: string =
    CommonConstant.Common.Constants.NAME_STATUS_ERROR;

  constructor(
    private propertyUpdateEntityTypesService: PropertyUpdateEntityTypesService,
    public filtersContainerService: PUExportImportQueueFilterContainerService,
    private router: Router,
    private exportImportService: PuExportImportService
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
          this.initDG(
            data.map((x) => {
              x.Name = x.Name || AppLocalization.WithoutName;
              x['Type'] = x.IsExport ? AppLocalization.Export : AppLocalization.Import;
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

  private loadTemplates() {
    const observs = [
      this.exportImportService.getImportTemplates(),
      this.exportImportService.getExportTemplates(),
    ];
    forkJoin(observs).subscribe(
      (data: [any[], any[]]) => {
        this.importTemplateMenu = data[0];
        this.exportTemplateMenu = data[1];
      },
      () => {        
      }
    );
  }

  private initDG(tasks: Task[]) {
    this.dataGrid.initDataGrid();
    this.dataGrid.KeyField = 'Id';
    this.dataGrid.SelectionRowMode = this.DGSelectionRowMode.Multiple;

    this.dataGrid.ActionButtons = [
      {
        Name: 'Abort',
        DisplayText: AppLocalization.Cancel,
        IsValid: (data: Task) => {
          return (
            data['State'].Code === 'NotYetExecuted' ||
            data['State'].Code === 'Executing'
          );
        },
      },
      {
        Name: 'Repeat',
        DisplayText: AppLocalization.TryAgain,
        IsValid: (data: Task) => {
          return (
            data['State'].Code === 'Aborted' ||
            data['State'].Code === 'Failed' ||
            data['State'].Code === 'Success'
          );
        },
      },
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
        Width: 100,
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
        Width: 100,
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
      promise = this.exportImportService.abortTask(button.item.Id);
      button.item.State.Name = AppLocalization.Canceled;
      button.item.State.Code = 'Canceling';
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

  private clearCacheCreate() {
    sessionStorage.removeItem(keyUnits);
    GlobalValues.Instance.Page.formReactive = null;
    GlobalValues.Instance.Page.entitiesSelected = null;
  }

  public navigateExportImport(type: number) {
    if (type === 1) {
      // export
      this.router.navigate(['property-update/export-import/create/export']);
    } else if (type === 2) {
      // import
      this.router.navigate(['property-update/export-import/create/import']);
    }
  }

  public subMenuClick(type: number, id: number) {
    this.clearCacheCreate();
    this.navigateExportImport(type);
  }

  deleteFromTemplate(importExportType: number, id: number) {
    this.loadingContent = true;
    this.exportImportService
      .deleteTemplate(importExportType, id)
      .then(() => {
        if (importExportType === 1) {
          this.exportTemplateMenu = this.exportTemplateMenu.filter(
            (x) => x.Id !== id
          );
        } else {
          this.importTemplateMenu = this.importTemplateMenu.filter(
            (x) => x.Id !== id
          );
        }
        this.loadingContent = false;
      })
      .catch((error) => {
        this.errors = [error];
        this.loadingContent = false;
      });
  }

  setNewFromTemplate(importExportType: number, id: number) {
    this.loadingContent = true;
    this.propertyUpdateEntityTypesService.getTemplate(importExportType, id)
        .subscribe(
          (data: BaseTaskParameters) => {
            if (data != null) {
              sessionStorage.removeItem(keyUnits);              
              GlobalValues.Instance.Page.formReactive = null;
              this.clearCacheCreate();

              let entitiesSelected: any[];
              let formReactive: any;
              const createEntitiesSelected = (data: any) => {
                entitiesSelected = entitiesSelected || [];
                entitiesSelected.push({ Id: data.Code, Name: data.Name, IdHierarchy: data.IdHierarchy });
              }
              const recursiveProps = (entityType: EntityType) => {
                let result: Property[] = [];
                const getPropsCheck = (properties: Property[]) => {
                  return properties.filter(x => x.IsActive);
                }
                const getPropsGroupCheck = (groups: PropertyGroup[]) => {
                  let resultGroups: Property[] = [];
                  (groups || []).forEach(g => {
                    resultGroups = [...resultGroups, ...getPropsCheck(g.PropertyTypes)];
                    resultGroups = [...resultGroups, ...getPropsGroupCheck(g.PropertyGroups)];
                  });
                  return resultGroups;
                }
                result = [...result, ...getPropsCheck(entityType.PropertyTypes)];
                result = [...result, ...getPropsGroupCheck(entityType.PropertyGroups)];
                return result;
              }
              const createFormReactiveSelected = (data: any, idHierarchy?: number) => {                
                formReactive = formReactive || {};
                (data.EntityTypes || []).forEach((et: EntityType) => {
                  const code = idHierarchy ? `${et.Code}.${idHierarchy}` : et.Code;
                  formReactive[code] = {};
                  formReactive[code].Props = recursiveProps(et);
                  (formReactive[code].Props || []).forEach((p: Property) => {
                    p['UniqueId'] = p.Code;
                  });
                });
              }

              const template: any = {};
              template.Name = data.Name;
              template.ActionType = data['ActionType'];
              if (data.ObjectsParameters != null && data.ObjectsParameters.Code != null) {
                createEntitiesSelected(data.ObjectsParameters);
                createFormReactiveSelected(data.ObjectsParameters);
                formReactive[data.ObjectsParameters.Code].entities = (data.ObjectsParameters.IdObjects || []).map(id => ({ Id: id }));
              }
              if (data.LogicDevicesParameters != null && data.LogicDevicesParameters.Code != null) {
                createEntitiesSelected(data.LogicDevicesParameters);
                createFormReactiveSelected(data.LogicDevicesParameters);
                formReactive[data.LogicDevicesParameters.Code].entities = (data.LogicDevicesParameters.IdLogicDevices || []).map(id => ({ Id: id }));
              }
              if (data.DevicesParameters != null && data.DevicesParameters.Code != null) {
                createEntitiesSelected(data.DevicesParameters);
                createFormReactiveSelected(data.DevicesParameters);
                formReactive[data.DevicesParameters.Code].entities = (data.DevicesParameters.IdDevices || []).map(id => ({ Id: id }));
              }
              if (data.HierarchiesParameters != null && data.HierarchiesParameters.length) {
                data.HierarchiesParameters.forEach((data: HierarchyParameters) => {
                  data.Code = `${data.Code}.${data.IdHierarchy}`;                  
                  createEntitiesSelected(data);
                  createFormReactiveSelected(data, data.IdHierarchy);
                  formReactive[data.Code].entities = (data.IdNodes || []).map(id => ({ Id: id }));
                });
              }
              template.entitiesSelected = entitiesSelected;
              template.formReactive = formReactive;

              GlobalValues.Instance.Page.Template = template;
            }            
            this.loadingContent = false;    
            this.navigateExportImport(importExportType);        
          },
          (error: any) => {
            this.loadingContent = false;
            this.errors.push(error);
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
    };
    this.loadingContent = true;
    this.exportImportService
      .getImportFiles(item.Files.map((x) => x.Path))
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (files) => {
          upload(files);
        },
        () => {
          this.errors = [{ ShortMessage: AppLocalization.NoFileFound }];
        }
      );
  }
}
