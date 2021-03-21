import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as GridControls from '../../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import SelectionRowMode = GridControls.SelectionRowMode;
import DGActionButton = GridControls.ActionButtons;
import DGDataColumnType = GridControls.DataColumnType;
import DGActionButtonConfirmSettings = GridControls.ActionButtonConfirmSettings;
import * as DateRangeModule from '../../../../common/models/Filter/DateRange';
import DateRange = DateRangeModule.Common.Models.Filter.DateRange;
import { Observable, Subscription, forkJoin } from 'rxjs';
import { finalize } from "rxjs/operators";
import { PermissionCheck } from "../../../../core";
import * as CommonConstant from "../../../../common/Constants";
import { JournalsFilterContainerService } from 'src/app/services/journal-system-events/Filters/JournalsFilterContainer.service';
import { EventLogRecord } from 'src/app/services/journal-system-events/Models/EventLogRecord';
import { ContextButtonItem } from 'src/app/controls/ContextButton/ContextButtonItem';
import { HierarchyMainStatesService } from 'src/app/services/hierarchy-main/hierarchy-main-states.service';
import { DetailsRow, DetailsRowComponent } from 'src/app/controls/ListComponentCommon/DetailsRow/DetailsRow';
import { ValResultMainDetailComponent } from 'src/app/components/validation.module/validation.result/validation.result.main/details.row/val.result.main.detail';
import { filterJournalValuesKey } from '../../../../modules/hierarchy-main/components/hierarchy-main/hierarchy-main.component';
import { SubSystem, LogicDevice, Acknowledged } from './filters';
import { FiltersCustomPanelComponent, Filter } from 'src/app/shared/rom-forms/filters.custompanel';

const statuses_names = CommonConstant.Common.Constants.ADMIN_MODULE.statuses_names;

@Component({
  selector: 'journal-system-events-component',
  templateUrl: './journal-system-events.component.html',
  styleUrls: ['./journal-system-events.component.less'],
})
export class JournalSystemEventsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public errors: any[] = [];
  public loadingContent: boolean;
  private BigDataSource: EventLogRecord[] = [];
  private filterKey: string; // фильтр примененный к гриду
  private DGSelectionRowMode = SelectionRowMode;
  private urlParamsSubscribe: Subscription;
  @ViewChild('frameFiltersCustompanel', { static: true })
  private frameFiltersCustompanel: FiltersCustomPanelComponent;
  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  public commandsActionSchedule: ContextButtonItem[];
  @ViewChild('logicDeviceCellTemplate', { static: true })
  private logicDeviceCellTemplate: TemplateRef<any>;
  @ViewChild('tagCellTemplate', { static: true })
  private tagCellTemplate: TemplateRef<any>;
  @ViewChild('userCellTemplate', { static: true })
  private userCellTemplate: TemplateRef<any>;
  @ViewChild('subsystemCellTemplate', { static: true })
  private subsystemCellTemplate: TemplateRef<any>;
  @ViewChild('stateCellTemplate', { static: true })
  private stateCellTemplate: TemplateRef<any>;
  @ViewChild('acknowledgedCellTemplate', { static: true })
  private acknowledgedCellTemplate: TemplateRef<any>;
  @ViewChild('dateAcknowledgedCellTemplate', { static: true })
  private dateAcknowledgedCellTemplate: TemplateRef<any>;

  constructor(
    public filtersContainerService: JournalsFilterContainerService,
    public hierarchyMainStatesService: HierarchyMainStatesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private permissionCheck: PermissionCheck
  ) {
    // this.urlParamsSubscribe = this.activatedRoute.parent.queryParams.subscribe(
    //   params => {
    //     debugger;
    //   }
    // );
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.loadFilter();
  }

  ngOnDestroy() {
    // this.urlParamsSubscribe.unsubscribe();
  }

  private loadFilter() {
    let applyFilter = false;
    const time = this.activatedRoute.parent.snapshot.queryParams.filter;
    if (time) {
      const filterContainer = localStorage.getItem(filterJournalValuesKey);
      if (filterContainer) {
        const filterContainerJson = JSON.parse(filterContainer);
        if (filterContainerJson[time]) {
          const jsonFilters = filterContainerJson[time];
          // SubSystem, LogicDevice, Acknowledged
          SubSystem.Value = jsonFilters['SubSystem'];
          SubSystem.Data = (jsonFilters['SubSystem'] || []).map((x: any) => ({
            IsCheck: true,
            Value: x,
          }));
          SubSystem.Lookup.DataSource = jsonFilters['SubSystem'];
          LogicDevice.Value = jsonFilters['LogicDevice'];
          LogicDevice.Data = (jsonFilters['LogicDevice'] || []).map((x: any) => ({
            IsCheck: true,
            Value: x,
          }));
          LogicDevice.Lookup.DataSource = jsonFilters['LogicDevice'];
          const fp = this.frameFiltersCustompanel;
          fp.FiltersContainer.Filters = [
            Object.assign(new Filter(), SubSystem as any),
            Object.assign(new Filter(), LogicDevice as any),
          ];
          if (jsonFilters['Acknowledged']) {
            fp.FiltersContainer.Filters.push(
              Object.assign(new Filter(), Acknowledged as any)
            );
          }
          applyFilter = true;
          fp.isFilterPanelShow = true;
          fp.applyFilter();
        }
      }
    }
    if (!applyFilter) {
      this.loadData();
    }
  }

  private loadData() {
    this.loadingContent = true;

    this.filtersContainerService.filtersService
      .getRecords(this.hierarchyMainStatesService, this.filterKey)
      .subscribe(
        (journals: EventLogRecord[]) => {
          this.initDG(journals);
          this.loadingContent = false;
        },
        (error: any) => {
          this.loadingContent = false;
          this.errors.push(error);
        }
      );
  }

  private initDG(journals: EventLogRecord[]) {
    this.accessDataGridInit().subscribe((results: boolean[]) => {
      this.dataGrid.initDataGrid();
      this.dataGrid.KeyField = 'Id';
      this.dataGrid.SelectionRowMode = this.DGSelectionRowMode.Multiple;

      if (results[0]) {
        this.dataGrid.ActionButtons = [
          new DGActionButton(
            'Active',
            AppLocalization.Kvitite,
            new DGActionButtonConfirmSettings(
              AppLocalization.YoureSureYouWantToGetYourChosenRecords,
              AppLocalization.Kvitite
            )
          ),
        ];
        this.commandsActionSchedule = [{ code: 'active', name: AppLocalization.Kvitite }];
      }

      this.dataGrid.Columns = [
        {
          Name: 'IdLogicDevice',
          Caption: AppLocalization.Label32,
          AggregateFieldName: ['DisplayText'],
          CellTemplate: this.logicDeviceCellTemplate,
          AppendFilter: false,
          Width: 250,
        },
        {
          Name: 'IdTag',
          Caption: AppLocalization.Tag,
          AggregateFieldName: ['Code', 'Name'],
          CellTemplate: this.tagCellTemplate,
          AppendFilter: false,
        },
        {
          Name: 'IdSubSystem',
          Caption: AppLocalization.Subsystem,
          AggregateFieldName: ['Name'],
          CellTemplate: this.subsystemCellTemplate,
          AppendFilter: false,
        },
        {
          Name: 'IdStateType',
          Caption: AppLocalization.State,
          AggregateFieldName: ['Code'],
          CellTemplate: this.stateCellTemplate,
          AppendFilter: false,
        },
        {
          Name: 'EventMessage',
          Caption: AppLocalization.Reason,
          AppendFilter: false,
          disableTextWrap: true,
        },
        {
          Name: 'EventDatetime',
          // CellTemplate: this.dateColumnTemplate,
          Caption: AppLocalization.GenerationDate,
          DataType: DGDataColumnType.DateTime,
          AppendFilter: false,
          disableTextWrap: true,
        },
        {
          Name: 'Datetime',
          Caption: AppLocalization.DataDate,
          DataType: DGDataColumnType.DateTime,
          AppendFilter: false,
          disableTextWrap: true,
        },
        {
          Name: 'Acknowledged',
          Caption: AppLocalization.Kvited,
          CellTemplate: this.acknowledgedCellTemplate,
          AppendFilter: false,
          disableTextWrap: true,
        },
        {
          Name: 'IdUserAcknowledge',
          Caption: AppLocalization.WhoDidThe100th,
          CellTemplate: this.userCellTemplate,
          AppendFilter: false,
          disableTextWrap: true,
        },
        {
          Name: 'AcknowledgeDatetime',
          Caption: AppLocalization.WhenKvited,
          DataType: DGDataColumnType.DateTime,
          CellTemplate: this.dateAcknowledgedCellTemplate,
          AppendFilter: false,
          disableTextWrap: true,
        },
      ];
      const dr = new DetailsRow();
      dr.components = [
        new DetailsRowComponent(
          AppLocalization.TransitionToDataView,
          ValResultMainDetailComponent
        ),
      ];
      this.dataGrid.DetailRow = dr;
      this.dataGrid.DataSource = journals;
    });
  }
  private accessDataGridInit(): Observable<boolean[]> {
    const checkAccess = ['ES_EVENT_ALLOW_ACKNOWLEDGE'];

    const obsrvs: any[] = [];
    checkAccess.forEach((access: string | string[]) => {
      obsrvs.push(this.permissionCheck.checkAuthorization(access));
    });

    return forkJoin<boolean>(obsrvs);
  }

  public onActionButtonClicked(button: any) {
    if (button.action === 'Active') {
      this.acknowledgesEvent((button.item.Acknowledged as string) === AppLocalization.No ? [button.item.Id] : []);
    }
  }

  itemActionEvent() {
    const ids = this.dataGrid
      .getSelectDataRows()
      .filter((x) => (x.Acknowledged as string) === AppLocalization.No)
      .map((item) => item[this.dataGrid.KeyField]);
    this.acknowledgesEvent(ids);
  }

  private acknowledgesEvent(items: number[]) {
    if (!(items || []).length) {
      this.errors = [AppLocalization.Label16];
      return;
    }
    this.loadingContent = true;
    this.filtersContainerService.filtersService
      .acknowledgesEvent(items)
      .then((res: any) => {
        this.loadData(); // ререндерим заново строки с бэкенда
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  public onApplyFilter(guid: string): void {
    this.filterKey = guid;
    this.loadData();
  }
}
