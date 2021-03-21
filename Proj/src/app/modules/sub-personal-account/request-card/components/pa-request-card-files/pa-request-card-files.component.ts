import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestService } from 'src/app/services/sub-personal-account/requests/request.service';
import { DataGrid } from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'rom-pa-request-card-files',
  templateUrl: './pa-request-card-files.component.html',
  styleUrls: ['./pa-request-card-files.component.less'],
})
export class PaRequestCardFilesComponent implements OnDestroy {
  public errors: any[] = [];
  public loadingContent: boolean;
  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('cellTemplateFile', { static: true })
  public cellTemplateFile: DataGrid;
  route$: Subscription;
  requestId: number | string;
  sub$: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService
  ) {
    this.route$ = this.activatedRoute.parent.params.subscribe((params) => {
      this.requestId = params.id;
      this.loadData();
    });
  }

  ngOnDestroy() {
    this.unsubscriber([this.route$, this.sub$]);
  }

  loadData() {
    this.sub$ = this.requestService.get(this.requestId).subscribe((data) => {
      if (data && data.Attachments) {
        this.initDG(data.Attachments);
      }
    });
  }

  private initDG(data: any) {
    this.dataGrid.KeyField = 'Id';

    this.dataGrid.Columns = [
      {
        Name: 'FileName',
        Caption: AppLocalization.FileName,
      },
      {
        Name: 'FilePath',
        Caption: AppLocalization.ThePathToTheFile,
        CellTemplate: this.cellTemplateFile,
      },
    ];
    this.dataGrid.DataSource = data;
  }

  downloadFile(file: string) {
    const download = (data: any) => {
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
    this.requestService
      .getFile(file)
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (files) => {
          download(files);
        },
        () => {
          this.errors = [{ ShortMessage: AppLocalization.NoFileFound }];
        }
      );
  }

  private unsubscriber(subs: Subscription[]) {
    subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
