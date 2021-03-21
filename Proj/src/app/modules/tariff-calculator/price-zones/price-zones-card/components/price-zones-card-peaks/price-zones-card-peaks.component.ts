import { AppLocalization } from 'src/app/common/LocaleRes';
import { PeakHour } from './../../../../../../services/tariff-calculator/models/peak-hour';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
  DataColumnType,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';
import { PeakHoursService } from 'src/app/services/tariff-calculator/peak-hours.service';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-price-zones-card-peaks',
  templateUrl: './price-zones-card-peaks.component.html',
  styleUrls: ['./price-zones-card-peaks.component.less'],
})
export class PriceZonesCardPeaksComponent implements OnInit {
  public loadingContent: boolean;
  public errors: any[] = [];
  public peakHours: PeakHour[];
  peakId: number;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('dateColumnTemplate', { static: true })
  private dateColumnTemplate: TemplateRef<any>;
  @ViewChild('peakHourColumnTemplate', { static: true })
  private peakHourColumnTemplate: TemplateRef<any>;

  constructor(
    private peakHoursService: PeakHoursService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private permissionCheckUtils: PermissionCheckUtils
  ) {
    this.peakId = peakHoursService.idPriceZone = this.activatedRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContent = true;
    this.peakHoursService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (peakHours: PeakHour[]) => {
          this.peakHours = peakHours;
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
        Caption: AppLocalization.DateAction,
        CellTemplate: this.dateColumnTemplate,
        DataType: DataColumnType.DateTime,
      },
      {
        Name: 'PeakHours',
        Caption: AppLocalization.PlannedPeakHours,
        CellTemplate: this.peakHourColumnTemplate,
      },
    ];
    
    this.permissionCheckUtils
      .getAccess([
        'TC_PLAN_PEAK_HOURS_DELETE'
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

    this.dataGrid.DataSource = this.peakHours;
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
      `tariff-calculator/price-zones/${this.peakId}/peak-hours/new`,
    ]);
  }

  private deleteItem(itemId: number) {
    return this.peakHoursService.deletePeakHour(itemId);
  }
}
