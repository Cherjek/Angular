import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionCheck } from 'src/app/core';
import { DataGrid, DataColumnType } from 'src/app/controls/DataGrid';
import Constants = ConstNamespace.Common.Constants;
import * as ConstNamespace from 'src/app/common/Constants';
import * as Filters from 'src/app/shared/rom-forms/filters.panel';
import { RequestResultStepsService } from 'src/app/services/requests.module/Result/request-result-steps.service';
import { ActivatedRoute } from '@angular/router';
import { DetailsRowComponent } from 'src/app/controls/ListComponentCommon/DetailsRow/DetailsRow';
import { RequestResultParametersComponent } from '../request-result-parameters/request-result-parameters.component';
import { RequestResultLogComponent } from '../request-result-log/request-result-log.component';

@Component({
  selector: 'rom-request-result-steps',
  templateUrl: './request-result-steps.component.html',
  styleUrls: ['./request-result-steps.component.css'],
  providers: [RequestResultStepsService]
})
export class RequestResultStepsComponent implements OnInit, OnDestroy {
  public loadingContentPanel = true;
  public errorsContentValidationForms: any[] = [];
  private deviceTypeId: number;
  @ViewChild('Ro5FiltersPanel', { static: true })
  ro5FiltersPanel: Filters.FiltersPanelComponent;
  @ViewChild('FilterIntervalControlTemplate', { static: true })
  filterIntervalControlTemplate: TemplateRef<any>;
  @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
  @ViewChild('CellTemplateLinkToDetail', { static: true })
  private cellTemplateLinkToDetail: TemplateRef<any>;
  @ViewChild('CellTemplateProgressTooltip', { static: true })
  private cellTemplateProgressTooltip: TemplateRef<any>;
  public NameStatusError: string = Constants.NAME_STATUS_ERROR;

  subscription$: Subscription;
  @ViewChild('gridName', { static: true })
  gridName: any;
  public DetailsRowComponents: DetailsRowComponent[] = [
    new DetailsRowComponent(AppLocalization.Log, RequestResultLogComponent, {componentHeight: 300}),
    new DetailsRowComponent(AppLocalization.Options, RequestResultParametersComponent)
  ];
  constructor(
    public permissionCheck: PermissionCheck,
    private dataSource: RequestResultStepsService,
    activatedRoute: ActivatedRoute
  ) {
    this.subscription$ = activatedRoute.parent.params.subscribe(
      params => (this.deviceTypeId = params.id)
    );
  }

  ngOnInit() {
    this.dataGrid.KeyField = 'Id';
    this.dataGrid.Columns = [
      {
        Name: 'State',
        Caption: AppLocalization.Status,
        CellTemplate: this.cellTemplateProgressTooltip,
        Width: 180,
        AggregateFieldName: ['Name']
      },
      {
        Name: 'Name',
        Caption: AppLocalization.Name,
      },
      {
        Name: 'CreateDate',
        Caption: AppLocalization.Create,
        DataType: DataColumnType.DateTime,
        Sortable: -1
      },
      {
        Name: 'StartDate',
        Caption: AppLocalization.Start,
        DataType: DataColumnType.DateTime
      },
      {
        Name: 'FinishDate',
        Caption: AppLocalization.End,
        DataType: DataColumnType.DateTime
      },
      {
        Name: 'UserName',
        Caption: AppLocalization.Initiator
      },
      /*{
        Name: 'Device',
        Caption: AppLocalization.Device,
        AggregateFieldName: ['Name'],
        CellTemplate: this.gridName
      },*/
      /*{
        Name: 'QueryType',
        Caption: AppLocalization.RequestType,
        AggregateFieldName: ['Name'],
        CellTemplate: this.gridName
      }*/
    ];
    this.loadData();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }


  /**
   * остановка таймера и загрузки данных
   */
  private loadData(): void {
    this.dataSource.getData(this.deviceTypeId).subscribe(
      (data: any[]) => {
        this.loadingContentPanel = false;
        this.loadContent(data);
      },
      error => {
        this.loadingContentPanel = false;
        this.errorsContentValidationForms.push(error);
      }
    );
  }

  /**
   *
   * @param data данные таблицы
   * Загрузка данных для таблицы
   */
  private loadContent(data: any[]) {
    this.dataGrid.DataSource = data;
  }
}
