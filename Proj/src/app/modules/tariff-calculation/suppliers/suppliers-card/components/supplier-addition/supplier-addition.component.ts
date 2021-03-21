import { AppLocalization } from 'src/app/common/LocaleRes';
import { SupplierAddition } from './../../../../../../services/taiff-calculation/suppliers/Models/supplier-addition';
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
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-supplier-addition',
  templateUrl: './supplier-addition.component.html',
  styleUrls: ['./supplier-addition.component.less'],
})
export class SupplierAdditionComponent implements OnInit {
  public loadingContent: boolean;
  public errors: any[] = [];
  public supplierAdditions: SupplierAddition[];
  idSupplier: number;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('orderNumberColumnTemplate', { static: true })
  private orderNumberColumnTemplate: TemplateRef<any>;
  @ViewChild('dateColumnTemplate', { static: true })
  private dateColumnTemplate: TemplateRef<any>;
  @ViewChild('orderDateColumnTemplate', { static: true })
  private orderDateColumnTemplate: TemplateRef<any>;

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private suppliersService: SuppliersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.idSupplier = suppliersService.idSupplier = this.activatedRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContent = true;
    this.suppliersService
      .getSupplierAdditions()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (supplierAdditions: SupplierAddition[]) => {
          this.supplierAdditions = supplierAdditions;
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
        Name: 'OrderNumber',
        Caption: AppLocalization.OrderNumb,
        CellTemplate: this.orderNumberColumnTemplate,
        DataType: DataColumnType.String,
      },
      {
        Name: 'Date',
        Caption: AppLocalization.StartActionDate,
        DataType: DataColumnType.DateTime,
        CellTemplate: this.dateColumnTemplate,
      },
      {
        Name: 'OrderDate',
        Caption: AppLocalization.TheDateOfTheOrder,
        DataType: DataColumnType.DateTime,
        CellTemplate: this.orderDateColumnTemplate,
      },
    ];
    
    this.permissionCheckUtils
      .getAccess([
        'TC_ADDITION_DELETE'
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

    this.dataGrid.DataSource = this.supplierAdditions;
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
      `tariff-calc/suppliers/${this.idSupplier}/addition/new/`,
    ]);
  }

  private deleteItem(itemId: number) {
    return this.suppliersService.deleteSupplierAddition(itemId);
  }
}
