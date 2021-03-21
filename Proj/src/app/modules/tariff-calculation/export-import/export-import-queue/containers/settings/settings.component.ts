import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDetailsComponent } from 'src/app/controls/ListComponentCommon/DetailsRow/IDetailsComponent';
import { finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Task } from 'src/app/services/taiff-calculation/export-import-queue/Models/Task';

@Component({
  selector: 'rom-tariff-export-import-parameters',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent
  implements OnInit, OnDestroy, IDetailsComponent {
  @Input() parentKey: any;
  @Input() params: any;
  data: Task;

  @Output() onLoadEnded = new EventEmitter<boolean>();
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
    
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContentPanel = true;
    this.subscription$ = this.loadParamData()
      .pipe(finalize(() => (this.loadingContentPanel = false)))
      .subscribe(
        (data: any) => {
          this.onLoadEnded.emit(true);
        },
        error => {
          this.errorsContentValidationForms.push(error);
        }
      );
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  private loadParamData(): Observable<any> {
    // const settings = this.data.IsExport ? this.data.ExportSettings : this.data.ImportSettings;
    return of([]);
  }
}