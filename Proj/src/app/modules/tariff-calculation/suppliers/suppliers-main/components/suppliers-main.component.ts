import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { Router } from '@angular/router';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import { Subscription } from 'rxjs';
import { PermissionCheckUtils } from 'src/app/core';
import { TariffSupplier } from 'src/app/services/taiff-calculation/suppliers/Models/TariffSupplier';

@Component({
  selector: 'app-suppliers-main',
  templateUrl: './suppliers-main.component.html',
  styleUrls: ['./suppliers-main.component.scss']
})
export class SuppliersMainComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public suppliers: TariffSupplier[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('typeNameColumnTemplate', { static: true })
  private typeNameColumnTemplate: TemplateRef<any>;
  @ViewChild('regionColumnTemplate', { static: true })
  private regionColumnTemplate: TemplateRef<any>;
  sub$: Subscription;

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private suppliersService: SuppliersService,
    private router: Router,
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
    this.sub$ = this.suppliersService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (suppliers: TariffSupplier[]) => {
          suppliers.forEach(x => {
            x.NonPriceZone = x.NonPriceZone ? AppLocalization.Yes : AppLocalization.No;
            return x;
          });
          this.suppliers = suppliers;
          this.initDG();
        },
        error => {
          this.errors = [error];
        }
      );
  }

  private initDG() {
    this.dataGrid.initDataGrid();
    this.dataGrid.KeyField = 'Id';

    this.dataGrid.Columns = [
      {
        Name: 'Code',
        Caption: AppLocalization.Code,
        AppendFilter: false,
        disableTextWrap: true
      },
      {
        Name: 'Name',
        Caption: AppLocalization.Name,
        CellTemplate: this.typeNameColumnTemplate,
        AppendFilter: false,
        disableTextWrap: true
      },
      {
        Name: 'Region',
        Caption: AppLocalization.Region,
        CellTemplate: this.regionColumnTemplate,
        AppendFilter: false,
        disableTextWrap: true
      },
      {
        Name: 'NonPriceZone',
        Caption: AppLocalization.NonPriceZone,
        AppendFilter: false,
        disableTextWrap: true
      },
    ];
    
    this.permissionCheckUtils
      .getAccess([
        'TC_SUPPLIER_DELETE'
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

    this.dataGrid.DataSource = this.suppliers;
  }

  onActionButtonClicked(event: any) {
    const itemId = event.item.Id;
    this.loadingContent = true;
    this.deleteItem(itemId)
      .then(() => {
        this.dataGrid.DataSource = (this.dataGrid.DataSource || []).filter(
          item => {
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

  addNewSupplier() {
    this.router.navigate(['tariff-calc/suppliers/new']);
  }

  private deleteItem(itemId: number) {
    return this.suppliersService.delete(itemId);
  }

  changeSupplier() {
    this.router.navigate(['tariff-calc/suppliers/change']);
  }
}
