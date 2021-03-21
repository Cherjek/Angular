import { AppLocalization } from 'src/app/common/LocaleRes';
import { TariffTransfer } from './../../../../../../services/tariff-calculator/models/tariff-transfer';
import { TariffTransferService } from './../../../../../../services/tariff-calculator/tariff-transfer.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
  DataColumnType,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-regions-card-transfer',
  templateUrl: './regions-card-transfer.component.html',
  styleUrls: ['./regions-card-transfer.component.less'],
})
export class RegionsCardTransferComponent implements OnInit {
  public loadingContent: boolean;
  public errors: any[] = [];
  public tariffTransfer: TariffTransfer[];
  idRegion: number;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('orderNumberColumnTemplate', { static: true })
  private orderNumberColumnTemplate: TemplateRef<any>;
  @ViewChild('dateColumnTemplate', { static: true })
  private dateColumnTemplate: TemplateRef<any>;
  @ViewChild('orderDateColumnTemplate', { static: true })
  private orderDateColumnTemplate: TemplateRef<any>;
  @ViewChild('supplyOrgColumnTemplate', { static: true })
  private supplyOrgColumnTemplate: TemplateRef<any>;

  constructor(
    private tariffTransferService: TariffTransferService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private permissionCheckUtils: PermissionCheckUtils
  ) {
    this.idRegion = tariffTransferService.idRegion = this.activatedRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContent = true;
    this.tariffTransferService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (tariffTransfers: TariffTransfer[]) => {
          this.tariffTransfer = tariffTransfers;
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
        Caption: AppLocalization.TariffsStartDate,
        DataType: DataColumnType.DateTime,
        CellTemplate: this.dateColumnTemplate,
      },
      {
        Name: 'OrderDate',
        Caption: AppLocalization.TheDateOfTheOrder,
        DataType: DataColumnType.DateTime,
        CellTemplate: this.orderDateColumnTemplate,
      },
      {
        Name: 'SupplyOrganizationType',
        Caption: AppLocalization.SupplyOrganizationType,
        DataType: DataColumnType.String,
        CellTemplate: this.supplyOrgColumnTemplate,
      },
    ];
    
    this.permissionCheckUtils
      .getAccess([
        'TC_TRANSFER_TARIFF_DELETE'
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

    this.dataGrid.DataSource = this.tariffTransfer;
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
      `tariff-calculator/regions/${this.idRegion}/transfers/new/`,
    ]);
  }

  private deleteItem(itemId: number) {
    return this.tariffTransferService.deleteTariffTransfer(itemId);
  }
}
