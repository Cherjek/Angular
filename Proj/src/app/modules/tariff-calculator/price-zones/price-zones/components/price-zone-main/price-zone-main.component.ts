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
import { PriceZoneService } from 'src/app/services/tariff-calculator/price-zone.service';
import { IPriceZone } from 'src/app/services/tariff-calculator/models/price-zone';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'price-zone-main',
  templateUrl: './price-zone-main.component.html',
  styleUrls: ['./price-zone-main.component.less'],
})
export class PriceZoneMainComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public priceZone: IPriceZone[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('typeNameColumnTemplate', { static: true })
  private typeNameColumnTemplate: TemplateRef<any>;
  sub$: Subscription;

  constructor(
    private priceZoneService: PriceZoneService,
    private router: Router,
    private permissionCheckUtils: PermissionCheckUtils
  ) {}

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
    this.sub$ = this.priceZoneService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (priceZones: IPriceZone[]) => {
          this.priceZone = priceZones;
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
        CellTemplate: this.typeNameColumnTemplate,
        AppendFilter: false,
        disableTextWrap: true,
      },
      {
        Name: 'Code',
        Caption: AppLocalization.Code,
        AppendFilter: false,
        disableTextWrap: true,
      },
    ];
    this.permissionCheckUtils
          .getAccess([
            'TC_PRICE_ZONE_DELETE'
          ], [
            new ActionButtons(
              'Delete',
              AppLocalization.Delete,
              new ActionButtonConfirmSettings(
                AppLocalization.DeleteConfirm,
                AppLocalization.Delete
              )
            )
          ])
          .subscribe(result => this.dataGrid.ActionButtons = result);

    this.dataGrid.DataSource = this.priceZone;
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
    this.router.navigate(['tariff-calculator/price-zones/new']);
  }

  private deleteItem(itemId: number) {
    return this.priceZoneService.delete(itemId);
  }
}
