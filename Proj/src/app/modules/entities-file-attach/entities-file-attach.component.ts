import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, OnDestroy, TemplateRef, Injector } from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
  DataColumnType,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccessDirectiveConfig, PermissionCheckUtils } from 'src/app/core';
import { EntitiesFileAttachService, entitiesAttachType } from 'src/app/services/entities-file-attach/entities-file-attach.service';

@Component({
  selector: 'rom-entities-file-attach',
  templateUrl: './entities-file-attach.component.html',
  styleUrls: ['./entities-file-attach.component.less'],
  providers: [EntitiesFileAttachService]
})
export class EntitiesFileAttachComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public tariffAttachement: any[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('cellTemplateFile', { static: true })
  private cellTemplateFile: TemplateRef<any>;
  additionId: number;
  sub$: Subscription;
  entityId: number;
  entityType: entitiesAttachType;
  unitId: number;
  idHierarchy: number;

  get entitySource() {
    return this.entityType === 'units' || this.entityType === 'devices' ? 'Units' :
    this.entityType === 'ld' ? 'LogicDevices' : 'Hierarchies';
  }
  get deletePermissionName() {
    return this.entityType === 'units' ? 'OC_REMOVE_OBJECT_ATTACHMENT' : 
      this.entityType === 'devices' ? 'OC_REMOVE_DEVICE_ATTACHMENT' :
      this.entityType === 'ld' ? 'OC_REMOVE_EQUIPMENT_ATTACHMENT' 
      : 'HH_REMOVE_HIERARCHY_NODE_ATTACHMENT';
  }
  get deletePermission() {
    const entityId = this.entityType === 'devices' ? this.unitId : 
      this.entityType === 'hierarchy' ? this.idHierarchy :
      this.entityId;
    return Object.assign(
      new AccessDirectiveConfig(), { keySource: entityId, source: this.entitySource, value: this.deletePermissionName }
    );
  }
  get addPermissionName() {
    return this.entityType === 'units' ? 'OC_ADD_OBJECT_ATTACHMENT' : 
      this.entityType === 'devices' ? 'OC_ADD_DEVICE_ATTACHMENT' :
      this.entityType === 'ld' ? 'OC_ADD_EQUIPMENT_ATTACHMENT' 
      : 'HH_ADD_HIERARCHY_NODE_ATTACHMENT';
  }
  get addPermission() {
    const entityId = this.entityType === 'devices' ? this.unitId : 
      this.entityType === 'hierarchy' ? this.idHierarchy :
      this.entityId;
    return Object.assign(
      new AccessDirectiveConfig(), { keySource: entityId, source: this.entitySource, value: this.addPermissionName }
    );
  }

  constructor(
    private entitiesFileAttachService: EntitiesFileAttachService,
    private permissionCheckUtils: PermissionCheckUtils,    
    private activatedRoute: ActivatedRoute
  ) {
    entitiesFileAttachService._entitiesAttachType = activatedRoute.snapshot.data.entity;
    this.entityId = activatedRoute.parent.snapshot.params.id;
    this.entityType = activatedRoute.snapshot.data.entity;0
    this.unitId = activatedRoute.snapshot.queryParams.unitId;
    this.idHierarchy = activatedRoute.snapshot.queryParams.idHierarchy;
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  private loadData() {
    this.loadingContent = true;
    this.entitiesFileAttachService
      .getAttachFiles(this.entityId)
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (attachments: any[]) => {
          this.tariffAttachement = attachments;
          this.initDG();
        },
        (error) => {
          this.errors = [error];
        }
      );
  }

  private initDG() {
    this.dataGrid.initDataGrid();
    this.dataGrid.KeyField = 'Id';

    this.dataGrid.Columns = [
      {
        Name: 'FileName',
        Caption: AppLocalization.FileName,
        DataType: DataColumnType.String,
      },
      {
        Name: 'FilePath',
        Caption: AppLocalization.ThePathToTheFile,
        DataType: DataColumnType.String,
        CellTemplate: this.cellTemplateFile,
      },
    ];
    
    this.permissionCheckUtils
      .getAccess([
        this.deletePermission
      ], [
        new ActionButtons(
          'Delete',
          AppLocalization.Delete,
          new ActionButtonConfirmSettings(
            AppLocalization.DeleteConfirm,
            AppLocalization.Delete
          )
        ),
      ])
      .subscribe(result => this.dataGrid.ActionButtons = result);

    this.dataGrid.DataSource = this.tariffAttachement;
  }

  onActionButtonClicked(event: any) {
    const itemId = event.item.Id;
    this.loadingContent = true;
    this.deleteItem(itemId)
      .then(() => {
        this.dataGrid.DataSource = this.dataGrid.DataSource.filter(
          (item) => item.Id !== itemId
        );
        this.loadingContent = false;
      })
      .catch((error: any) => {
        this.errors.push(error);
        this.loadingContent = false;
      });
  }

  public onFileUpload(data: File) {
    this.loadingContent = true;
    this.entitiesFileAttachService.saveFile(data, this.entityId)
      .then(() => {
        this.loadingContent = false;
        this.loadData();
      })
      .catch((error) => {
        this.errors = [error];
        this.loadingContent = false;
      });
  }

  downloadFile(file: string) {
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
    this.entitiesFileAttachService
      .getFile(file, this.entityId)
      .pipe(
        finalize(() => this.loadingContent = false)
      )
      .subscribe((files) => {
        upload(files);
      }, (error: any) => {
        this.errors = [{ShortMessage: AppLocalization.NoFileFound}];
      });
  }

  onError(error: { ShortMessage: '' }[]) {
    this.errors = error;
  }

  private deleteItem(itemId: number) {
    return this.entitiesFileAttachService.deleteAttachFile(this.entityId, itemId);
  }
}
