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
import { ActivatedRoute } from '@angular/router';
import { DetailsRowComponent } from 'src/app/controls/ListComponentCommon/DetailsRow/DetailsRow';

import { ManagementResultStepsService } from 'src/app/services/managements.module/Result/management-result-steps.service';
import { ManagementResultParametersComponent } from '../management-result-parameters/management-result-parameters.component';
import { ManagementResultLogComponent } from '../management-result-log/management-result-log.component';

@Component({
  selector: 'rom-management-result-step',
  templateUrl: './management-result-steps.component.html',
  styleUrls: ['./management-result-steps.component.less']
})
export class ManagementResultStepsComponent implements OnInit, OnDestroy {
  public loadingContentPanel = true;
  public errorsContentValidationForms: any[] = [];
  private deviceTypeId: number;
  @ViewChild('Ro5FiltersPanel', { static: true })
  ro5FiltersPanel: Filters.FiltersPanelComponent;
  @ViewChild('FilterIntervalControlTemplate', { static: true })
  filterIntervalControlTemplate: TemplateRef<any>;
  @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
  @ViewChild('CellTemplateProgressTooltip', { static: true })
  private cellTemplateProgressTooltip: TemplateRef<any>;
  public NameStatusError: string = Constants.NAME_STATUS_ERROR;

  subscription$: Subscription;
  @ViewChild('gridName', { static: true })
  gridName: any;
  public DetailsRowComponents: DetailsRowComponent[] = [
    new DetailsRowComponent(AppLocalization.Log, ManagementResultLogComponent, {componentHeight: 300}),
    new DetailsRowComponent(AppLocalization.Options, ManagementResultParametersComponent)
  ];
  constructor(
    public permissionCheck: PermissionCheck,
    private dataSource: ManagementResultStepsService,
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
        Caption: AppLocalization.Name
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
      }
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
