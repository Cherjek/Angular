import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
  DataColumnType,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import { SupplierEnergyPrice } from 'src/app/services/taiff-calculation/suppliers/Models/supplier-energy-price';
import { DateTimeFormatPipe } from 'src/app/shared/rom-pipes/date-time-format.pipe';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-supplier-energy-price',
  templateUrl: './supplier-energy-price.component.html',
  styleUrls: ['./supplier-energy-price.component.less'],
})
export class SupplierEnergyPriceComponent implements OnInit {
  public loadingContent: boolean;
  public errors: any[] = [];
  public energyPrices: SupplierEnergyPrice[];
  idSupplier: number;
  private dateFormat: DateTimeFormatPipe;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('dateColumnTemplate', { static: true })
  private dateColumnTemplate: TemplateRef<any>;

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private suppliersService: SuppliersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.dateFormat = new DateTimeFormatPipe('ru');
    this.idSupplier = suppliersService.idSupplier = this.activatedRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContent = true;
    this.suppliersService
      .getSupplierEnergyPrices()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (energyPrices: SupplierEnergyPrice[]) => {
          energyPrices.forEach((energy) => {
            energy.Date = this.transformDate(energy.Date);
          });
          this.energyPrices = energyPrices;
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
        Caption: AppLocalization.Date,
        DataType: DataColumnType.DateTime,
        CellTemplate: this.dateColumnTemplate,
      },
    ];
    
    this.permissionCheckUtils
      .getAccess([
        'TC_ENERGY_PRICE_DELETE'
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

    this.dataGrid.DataSource = this.energyPrices;
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
      `tariff-calc/suppliers/${this.idSupplier}/energy-price/new/`,
    ]);
  }

  private deleteItem(itemId: number) {
    return this.suppliersService.deleteSupplierEnergyPrice(itemId);
  }

  private transformDate(date: any) {
    if (date) {
      const dateTransform = this.dateFormat.transform(date);
      return (date.substr(0, dateTransform.length - 9) as string).replace(
        '-',
        '.'
      );
    }
  }
}
