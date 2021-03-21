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
import { IManagementParams } from 'src/app/services/managements.module/Models/management-params';
import { ManagementResultService } from 'src/app/services/managements.module/Result/management-result.service';

@Component({
  selector: 'rom-management-result-parameters',
  templateUrl: './management-result-parameters.component.html',
  styleUrls: ['./management-result-parameters.component.less']
})
export class ManagementResultParametersComponent
  implements OnInit, OnDestroy, IDetailsComponent {
  @Input() parentKey: any;
  @Input() params: any;
  data: any;

  @Output() onLoadEnded = new EventEmitter<boolean>();
  /**
   * Идентификатор выбранного оборудования
   */
  managementId: number;
  /**
   * Данные из бэкэнд
   */
  managementParamsData: IManagementParams;
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
    private manageParamsService: ManagementResultService,
    private router: Router
  ) {
    this.managementId = this.activatedRoute.parent.snapshot.params.id;
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
        (data: IManagementParams) => {
          this.managementParamsData = data;
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

  private loadParamData(): Observable<IManagementParams> {
    if (!this.hideHeader) {
      const cached = this.manageParamsService.getCache(this.managementId);

      return cached
        ? of(cached)
        : this.manageParamsService.getData(this.managementId);
    } else {
      return this.manageParamsService.getsubData(
        this.managementId,
        this.data.Id
      );
    }
  }
}
