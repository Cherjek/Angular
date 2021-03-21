import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestResultService } from 'src/app/services/requests.module/Result/request-result.service';
import { IDetailsComponent } from 'src/app/controls/ListComponentCommon/DetailsRow/IDetailsComponent';
import { finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IDatabaseDataQueryTask, IDatabaseTask, IDatabaseCommon, DatabaseTaskType, IQueryTypeTags, ILogicDeviceTagTypeInfo } from 'src/app/services/data-query';
import { Tag } from 'src/app/services/common/Models/Tag';
import { ViewTagsSettings } from 'src/app/services/datapresentation.module/Models/ViewTagsSettings';
import { DataResultSettingsService } from 'src/app/services/datapresentation.module/DataResultSettings.service';

@Component({
  selector: 'rom-request-result-parameters',
  templateUrl: './request-result-parameters.component.html',
  styleUrls: ['./request-result-parameters.component.less']
})
export class RequestResultParametersComponent
  implements OnInit, OnDestroy, IDetailsComponent {
  @Input() parentKey: any;
  @Input() params: any;
  @ViewChild('chipsTagsControl', {static: false}) chipsTagsControl: any;
  fromDate: any;
  toDate: any;
  data: any;
  chipsTags: Tag[];
  errorsResponseToView: any[] = [];
  isDataPresentation = false;

  @Output() onLoadEnded = new EventEmitter<boolean>();
  /**
   * Идентификатор выбранного оборудования
   */
  deviceTypeId: number;
  /**
   * Данные из бэкэнд
   */
    logicDeviceData: IDatabaseCommon;
  /**
   * Логическое отображение или скрытие значка загрузки
   */
  loadingContentPanel = true;
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
    private reqResultService: RequestResultService,
    private router: Router,
    private dataResultSettingsService: DataResultSettingsService
  ) {
    this.deviceTypeId = this.activatedRoute.parent.snapshot.params.id;
  }
  get hideHeader() {
    return this.router.url.includes('steps');
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.subscription$ = this.loadParamData()
      .pipe(finalize(() => (this.loadingContentPanel = false)))
      .subscribe(
          (data: IDatabaseDataQueryTask | IDatabaseTask) => {
            this.fromDate = data.StartDate;
            this.toDate = data.FinishDate;
            if (!data.hasOwnProperty('QueryTypeTags')) {
                data['QueryTypeTags'] = [
                  {
                    QueryType: (data as IDatabaseTask).QueryType,
                    TagCodes: (data as IDatabaseTask).TagCodes,
                    AllTagCodes: false
                  }
                ];
            }
            this.logicDeviceData = data;
            this.onLoadEnded.emit(true);

            const ids = (this.logicDeviceData as IDatabaseDataQueryTask).IdLogicDevices;
            this.reqResultService
              .getTags(ids)
              .then((tags: any[]) => {
                if (data['QueryTypeTags'] && data['QueryTypeTags'].length) {
                  const chips = (data['QueryTypeTags'])
                    .map((x: IQueryTypeTags) => x.TagCodes)
                    .reduce((x: ILogicDeviceTagTypeInfo[], y: ILogicDeviceTagTypeInfo[]) => x.concat(y))
                    .map((x: ILogicDeviceTagTypeInfo) => new Tag(x.Id, x.Name, x.Code));

                  this.chipsTags = tags
                    .filter((tag: any) => {
                      if (tag) {
                        return chips.find((c: Tag) => c.Code.indexOf(tag.TagCode) >= 0) != null;
                      }
                    })
                    .map(x => new Tag(x.TagId, x.TagName, x.TagCode));
                }
              });
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

  public getItemsInput(): any[] {
    return (this.chipsTags || []).map(t => t.Code + ' ' + t.Name);
  }

  public clickResponseToView(chips: any): void {
    chips = this.chipsTagsControl.chips;
    this.errorsResponseToView = [];

    let selectChips: any[] = [];
    if (chips && chips.length) {
        selectChips = (this.chipsTags || []).filter((tag: any) => {
            if (tag) {
              return chips.find((c: string) => c.indexOf(tag.Code) >= 0) != null;
            }
        });
    }

    const request: ViewTagsSettings = {
        tags: selectChips.map((tag: any) => tag.Id),
        fromDate: this.fromDate,
        toDate: this.toDate
    };

    if (!request.fromDate) { this.errorsResponseToView.push(AppLocalization.NoDateSelected); }

    if (!this.errorsResponseToView.length) {
        this.dataResultSettingsService.setSettings(request);
        this.router.navigate(['datapresentation/result/data']);
    }
}

  private loadParamData(): Observable<IDatabaseDataQueryTask | IDatabaseTask> {

    if (!this.hideHeader) {
      const dataPrefix = 'task-data-';
      const cached = this.reqResultService.getCache(
        dataPrefix + this.deviceTypeId
      );

      return cached
        ? of(cached)
        : this.reqResultService.getData(this.deviceTypeId);
    } else {
      return this.reqResultService.getsubData(
        this.data.Id,
        +DatabaseTaskType[this.data.TaskTypeCode]
      );
    }
  }
}
