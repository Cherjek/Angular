import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegionService } from 'src/app/services/tariff-calculator/region.service';
import { Region } from 'src/app/services/tariff-calculator/models/region';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-regions-main',
  templateUrl: './regions-main.component.html',
  styleUrls: ['./regions-main.component.less'],
})
export class RegionsMainComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public region: Region[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('nameColumnTemplate', { static: true })
  private nameColumnTemplate: TemplateRef<any>;
  @ViewChild('priceColumnTemplate', { static: true })
  private priceColumnTemplate: TemplateRef<any>;
  @ViewChild('timeZoneTemplate', { static: true })
  private timeZoneTemplate: TemplateRef<any>;
  @ViewChild('peakTimeZoneTemplate', { static: true })
  private peakTimeZoneTemplate: TemplateRef<any>;
  @ViewChild('oesColumnTemplate', { static: true })
  private oesColumnTemplate: TemplateRef<any>;
  sub$: Subscription;

  constructor(
    private regionService: RegionService, 
    private router: Router,
    private permissionCheckUtils: PermissionCheckUtils) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = this.regionService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (oeses: Region[]) => {
          this.region = oeses;
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
        Name: 'Name',
        Caption: AppLocalization.Name,
        CellTemplate: this.nameColumnTemplate,
        AppendFilter: false,
        disableTextWrap: true,
      },
      {
        Name: 'Code',
        Caption: AppLocalization.Code,
        AppendFilter: false,
        disableTextWrap: true,
      },
      {
        Name: 'TimeZone',
        Caption: AppLocalization.TimeZone,
        AggregateFieldName: ['Code', 'Name'],
        AppendFilter: false,
        disableTextWrap: true,
        CellTemplate: this.timeZoneTemplate,
      },
      {
        Name: 'AtsTimeZone',
        Caption: AppLocalization.Label118,
        AggregateFieldName: ['Code', 'Name'],
        AppendFilter: false,
        disableTextWrap: true,
        Width: 180,
        CellTemplate: this.peakTimeZoneTemplate,
      },
      {
        Name: 'PriceZone',
        Caption: AppLocalization.Label114,
        AggregateFieldName: ['Code', 'Name'],
        CellTemplate: this.priceColumnTemplate,
        AppendFilter: false,
        disableTextWrap: true,
      },
      {
        Name: 'Oes',
        Caption: AppLocalization.Eco,
        AggregateFieldName: ['Code', 'Name'],
        CellTemplate: this.oesColumnTemplate,
        AppendFilter: false,
        disableTextWrap: true,
      },
    ];
    
    this.permissionCheckUtils
      .getAccess([
        'TC_REGION_DELETE'
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

    this.dataGrid.DataSource = this.region;
  }

  onActionButtonClicked(event: any) {
    const itemId = event.item.Id;
    this.loadingContent = true;
    this.deleteItem(itemId)
      .then(() => {
        this.dataGrid.DataSource = (this.dataGrid.DataSource || []).filter(
          (item) => {
            if (item) {
              return item.Id !== itemId;
            }
          }
        );
        this.loadingContent = false;
      })
      .catch((error: any) => {
        this.errors.push(error);
        this.loadingContent = false;
      });
  }

  addNewItem() {
    this.router.navigate(['tariff-calculator/regions/new']);
  }

  private deleteItem(itemId: number) {
    return this.regionService.delete(itemId);
  }
}
