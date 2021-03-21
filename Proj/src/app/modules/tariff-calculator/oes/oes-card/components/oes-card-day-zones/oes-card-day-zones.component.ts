import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
  DataColumnType,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';
import { DayZonesService } from 'src/app/services/tariff-calculator/day-zone.service';
import { DayZone } from 'src/app/services/tariff-calculator/models/day-zone';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-oes-card-day-zones',
  templateUrl: './oes-card-day-zones.component.html',
  styleUrls: ['./oes-card-day-zones.component.less'],
})
export class OesCardDayZonesComponent implements OnInit {
  public loadingContent: boolean;
  public errors: any[] = [];
  public dayZones: DayZone[];
  oesId: number;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('dateColumnTemplate', { static: true })
  private dateColumnTemplate: TemplateRef<any>;
  @ViewChild('orderDateColumnTemplate', { static: true })
  private orderDateColumnTemplate: TemplateRef<any>;
  @ViewChild('nightHoursColumnTemplate', { static: true })
  private nightHoursColumnTemplate: TemplateRef<any>;
  @ViewChild('dayHoursColumnTemplate', { static: true })
  private dayHoursColumnTemplate: TemplateRef<any>;

  constructor(
    private dayZonesService: DayZonesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private permissionCheckUtils: PermissionCheckUtils
  ) {
    this.oesId = dayZonesService.idOes = this.activatedRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContent = true;
    this.dayZonesService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (dayZones: DayZone[]) => {
          this.dayZones = dayZones;
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
        Name: 'Date',
        Caption: AppLocalization.TheStartDateOfTheZones,
        CellTemplate: this.dateColumnTemplate,
        DataType: DataColumnType.DateTime,
      },
      {
        Name: 'OrderDate',
        Caption: AppLocalization.TheDateOfTheOrder,
        DataType: DataColumnType.DateTime,
        CellTemplate: this.orderDateColumnTemplate,
      },
      {
        Name: 'OrderNumber',
        Caption: AppLocalization.OrderNumb,
        DataType: DataColumnType.String,
      },
      {
        Name: 'DayHours',
        Caption: AppLocalization.PeakZone,
        CellTemplate: this.dayHoursColumnTemplate,
      },
      {
        Name: 'NightHours',
        Caption: AppLocalization.NightZone,
        CellTemplate: this.nightHoursColumnTemplate,
      },
    ];
    
    this.permissionCheckUtils
      .getAccess([
        'TC_DAY_ZONE_DELETE'
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

    this.dataGrid.DataSource = this.dayZones;
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
        this.errors.push(error);
        this.loadingContent = false;
      });
  }

  addNewItem() {
    this.router.navigate([
      `tariff-calculator/oeses/${this.oesId}/day-zones/new/`,
    ]);
  }

  private deleteItem(itemId: number) {
    return this.dayZonesService.deleteDayZone(itemId);
  }
}
