import { AppLocalization } from 'src/app/common/LocaleRes';
import { TariffAttachment } from './../../../../../services/tariff-calculator/models/tariff-attachment';
import { Component, OnInit, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
  DataColumnType,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { TariffTransferService } from 'src/app/services/tariff-calculator/tariff-transfer.service';
import { Subscription } from 'rxjs';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-tariff-transfer-card-files',
  templateUrl: './tariff-transfer-card-files.component.html',
  styleUrls: ['./tariff-transfer-card-files.component.less'],
})
export class TariffTransferCardFilesComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public tariffAttachement: TariffAttachment[];
  public file: File;
  idRegion: number;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('cellTemplateFile', { static: true })
  private cellTemplateFile: TemplateRef<any>;
  tariffTransferId: number;
  sub$: Subscription;

  constructor(
    private tariffTransferService: TariffTransferService,
    private activatedRoute: ActivatedRoute,
    private permissionCheckUtils: PermissionCheckUtils
  ) {
    this.sub$ = this.activatedRoute.parent.params.subscribe((param) => {
      this.idRegion = tariffTransferService.idRegion = param.regionId;
      this.tariffTransferId = tariffTransferService.idTariffTransfer = param.id;
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
      .getAttachments()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (attachments: TariffAttachment[]) => {
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
        'TC_TRANSFER_TARIFF_DELETE_ATTACHMENT'
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
        this.errors = [error];
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

  onError(error: { ShortMessage: '' }[]) {
    this.errors = error;
  }

  private deleteItem(itemId: number) {
    return this.tariffTransferService.deleteAttachment(itemId);
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
}
