import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import {
  DataGrid,
  ActionButtons as DGActionButton,
  ActionButtonConfirmSettings as DGActionButtonConfirmSettings,
  DataColumnType,
} from 'src/app/controls/DataGrid';
import { Subscription } from 'rxjs';
import { TariffHistoryService } from 'src/app/services/tariff-calculator/tariff-history.service';
import { ILogicDeviceTariffHistory } from 'src/app/services/tariff-calculator/models/logic-device-tariff-history';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-lde.tariff',
  templateUrl: './lde.tariff.component.html',
  styleUrls: ['./lde.tariff.component.less'],
  providers: [TariffHistoryService],
})
export class LDETariffComponent implements OnInit, OnDestroy {
  public loadingContent = true;
  public errors: any[] = [];
  idLogicDevice: number;

  @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;
  @ViewChild('supplierTemplate', { static: false })
  public supplierTemplate: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: false })
  public dateTemplate: TemplateRef<any>;
  @ViewChild('maxPowerTemplate', { static: false })
  public maxPowerTemplate: TemplateRef<any>;
  @ViewChild('agreementTemplate', { static: false })
  public agreementTemplate: TemplateRef<any>;
  @ViewChild('priceCategoryTemplate', { static: false })
  public priceCategoryTemplate: TemplateRef<any>;
  @ViewChild('powerLevelTemplate', { static: false })
  public powerLevelTemplate: TemplateRef<any>;
  @ViewChild('supplyOrgTemplate', { static: false })
  public supplyOrgTemplate: TemplateRef<any>;
  @ViewChild('generatorTemplate', { static: false })
  public generatorTemplate: TemplateRef<any>;
  data$: Subscription;

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tariffHistoryService: TariffHistoryService
  ) {
    this.idLogicDevice = this.activatedRoute.parent.snapshot.params.id;

    tariffHistoryService.idLogicDevice = this.idLogicDevice;
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.data$) {
      this.data$.unsubscribe();
    }
  }

  addItem(idTariff = 'new') {
    this.router.navigate([`${idTariff}`], {
      relativeTo: this.activatedRoute,
    });
  }

  onDGRowActionBtnClick(button: any) {
    if (button.action === 'Delete') {
      this.delete(button.item);
    }
  }

  private loadData() {
    this.data$ = this.tariffHistoryService
      .getLogicDeviceHistories()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (histories: ILogicDeviceTariffHistory[]) => {
          this.initDG(histories);
        },
        (error) => {
          this.errors = [error];
        }
      );
  }

  private initDG(histories: ILogicDeviceTariffHistory[]) {
    this.dataGrid.initDataGrid();

    this.dataGrid.KeyField = 'Id';
    this.dataGrid.Columns = [
      {
        Name: 'StartDate',
        Caption: AppLocalization.SettingsStartDate,
        DataType: DataColumnType.Date,
        CellTemplate: this.dateTemplate,
      },
      {
        Name: 'Supplier',
        Caption: AppLocalization.GuaranteeingSupplier,
        CellTemplate: this.supplierTemplate,
      },
      {
        Name: 'MaxPowerType',
        Caption: AppLocalization.MaximumPower,
        CellTemplate: this.maxPowerTemplate,
      },
      {
        Name: 'PowerLevelType',
        Caption: AppLocalization.VoltageLevel,
        CellTemplate: this.powerLevelTemplate,
      },
      {
        Name: 'AgreementType',
        Caption: AppLocalization.AgreementType,
        CellTemplate: this.agreementTemplate,
      },
      {
        Name: 'SupplyOrganizationType',
        Caption: AppLocalization.SupplyOrganizationType,
        CellTemplate: this.supplyOrgTemplate,
      },
      {
        Name: 'IsGenerator',
        DataType: DataColumnType.Boolean,
        Caption: AppLocalization.GeneratorVoltage,
        CellTemplate: this.generatorTemplate,
      },
      {
        Name: 'PriceCategory',
        Caption: AppLocalization.PriceCategory,
        CellTemplate: this.priceCategoryTemplate,
      },
    ];
    
    this.permissionCheckUtils
      .getAccess([
        'TC_LOGIC_DEVICE_TARIFF_DELETE'
      ], [
        new DGActionButton(
          'Delete',
          AppLocalization.Delete,
          new DGActionButtonConfirmSettings(
            AppLocalization.DeleteConfirm,
            AppLocalization.Delete
          )
        ),
      ])
      .subscribe(result => this.dataGrid.ActionButtons = result);

    this.dataGrid.DataSource = histories;
  }

  private delete(history: ILogicDeviceTariffHistory) {
    this.loadingContent = true;
    this.tariffHistoryService
      .deleteLogicDeviceHistory(history.Id)
      .then((result: any) => {
        if (result === 0) {
          this.loadData();
        }
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }
}
