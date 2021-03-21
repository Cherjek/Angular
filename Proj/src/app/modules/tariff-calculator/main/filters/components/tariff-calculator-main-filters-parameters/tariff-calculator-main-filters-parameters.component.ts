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
import { Observable, of } from 'rxjs';
import { TariffMainTaskService } from 'src/app/services/taiff-calculation/export-import-queue/Task/TariffMainTask.service';
import { TariffCalculatorTask } from 'src/app/services/tariff-calculator/main/models/tariff-calculator-task';
import { File } from 'src/app/services/taiff-calculation/export-import-queue/Models/File';

@Component({
  selector: 'rom-tariff-calculator-main-filters-parameters',
  templateUrl: './tariff-calculator-main-filters-parameters.component.html',
  styleUrls: ['./tariff-calculator-main-filters-parameters.component.less'],
})
export class TariffCalculatorMainFiltersParametersComponent
  implements OnInit, OnDestroy, IDetailsComponent {
  @Input() parentKey: any;
  @Input() params: any;
  data: any;
  public errors: any[] = [];

  @Output() onLoadEnded = new EventEmitter<boolean>();
  /**
   * Идентификатор выбранного оборудования
   */
  taskId: number;
  /**
   * Данные из бэкэнд
   */
  taskParamsData: TariffCalculatorTask;
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
    private tariffMainTaskService: TariffMainTaskService,
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
        (data: TariffCalculatorTask) => {
          data.Files = data.CalculationGroups
          .filter(cg => cg.File != null)
          .map(cg => cg.File);
          this.taskParamsData = data;
          this.onLoadEnded.emit(true);
        },
        (error) => {
          this.errorsContentValidationForms.push(error);
        }
      );
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
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
    this.tariffMainTaskService
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

  private loadParamData(): Observable<any> {
    if (!this.hideHeader) {
      const cached = this.tariffMainTaskService.getCache(this.taskId);

      return cached
        ? of(cached)
        : this.tariffMainTaskService.getData(this.taskId);
    } else {
      return this.tariffMainTaskService.getsubData(this.taskId, this.data.Id);
    }
  }
}
