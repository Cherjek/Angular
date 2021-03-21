import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDetailsComponent } from 'src/app/controls/ListComponentCommon/DetailsRow/IDetailsComponent';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ImportExportResult } from 'src/app/services/taiff-calculation/export-import-queue/Models/ImportExportResult';
import { File } from 'src/app/services/taiff-calculation/export-import-queue/Models/File';
import { PuExportImportService } from 'src/app/services/property-update/filters/pu-export-import.service';

@Component({
  selector: 'app-property-update-export-import-result-parameters',
  templateUrl:
    './property-update-export-import-result-parameters.component.html',
  styleUrls: [
    './property-update-export-import-result-parameters.component.less',
  ],
})
export class PropertyUpdateExportImportResultParametersComponent
  implements OnInit, OnDestroy, IDetailsComponent {
  @Input() parentKey: any;
  @Input() params: any;
  data: any;

  @Output() onLoadEnded = new EventEmitter<boolean>();
  /**
   * Идентификатор выбранного оборудования
   */
  taskId: number;
  /**
   * Данные из бэкэнд
   */
  taskData: ImportExportResult;
  /**
   * Логическое отображение или скрытие значка загрузки
   */
  loadingContentPanel: boolean;
  /**
   * subscription для данных от бэкэнда
   */
  subscription$: any;
  /**
   * Массив для сбора ошибок для отображения в виджете ошибка
   */

  public errorsContentValidationForms: any[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private exportImportService: PuExportImportService,
    private router: Router
  ) {
    this.taskId = this.activatedRoute.parent.snapshot.params.id;
  }
  get hideHeader() {
    return this.router.url.includes('steps');
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContentPanel = true;
    this.subscription$ = this.loadParamData()
      .pipe(finalize(() => (this.loadingContentPanel = false)))
      .subscribe(
        (data: ImportExportResult) => {
          this.taskData = data;
          this.onLoadEnded.emit(true);
        },
        (error) => {
          this.errorsContentValidationForms = [error];
        }
      );
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  private loadParamData(): Observable<any> {
    return this.exportImportService.getTask(this.taskId);
  }

  downloadFile(files: File[]) {
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
    this.loadingContentPanel = true;
    this.exportImportService
      .getImportFiles(files.map((x) => x.Path))
      .pipe(finalize(() => (this.loadingContentPanel = false)))
      .subscribe(
        (files) => {
          upload(files);
        },
        () => {
          this.errorsContentValidationForms = [
            { ShortMessage: AppLocalization.NoFileFound },
          ];
        }
      );
  }
}
