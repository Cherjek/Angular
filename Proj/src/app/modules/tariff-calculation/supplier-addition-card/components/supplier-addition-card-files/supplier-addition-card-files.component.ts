import { AppLocalization } from 'src/app/common/LocaleRes';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import { Component, OnInit, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
  DataColumnType,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-supplier-addition-card-files',
  templateUrl: './supplier-addition-card-files.component.html',
  styleUrls: ['./supplier-addition-card-files.component.less'],
})
export class SupplierAdditionCardFilesComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public tariffAttachement: any[];
  idRegion: number;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('cellTemplateFile', { static: true })
  private cellTemplateFile: TemplateRef<any>;
  additionId: number;
  sub$: Subscription;

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private tariffTransferService: SuppliersService,
    private activatedRoute: ActivatedRoute
  ) {
    this.sub$ = this.activatedRoute.parent.params.subscribe((param) => {
      this.idRegion = tariffTransferService.idSupplier = param.supplierId;
      this.additionId = tariffTransferService.idAddition = param.id;
    });
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
    this.tariffTransferService
      .getSupplierFiles()
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
        'TC_ADDITION_DELETE_ATTACHMENT'
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
    this.tariffTransferService.saveFile(data)
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
    this.tariffTransferService
      .getFile(file)
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
    return this.tariffTransferService.deleteSupplierFile(itemId);
  }
}
