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
import { OesService } from 'src/app/services/tariff-calculator/oes.service';
import { IOES } from 'src/app/services/tariff-calculator/models/oes';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-oes-main',
  templateUrl: './oes-main.component.html',
  styleUrls: ['./oes-main.component.less'],
})
export class OesMainComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public oes: IOES[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('typeNameColumnTemplate', { static: true })
  private typeNameColumnTemplate: TemplateRef<any>;
  sub$: Subscription;

  constructor(
    private oesService: OesService, 
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
    this.sub$ = this.oesService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (oeses: IOES[]) => {
          this.oes = oeses;
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
        'TC_OES_DELETE'
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

    this.dataGrid.DataSource = this.oes;
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
    this.router.navigate(['tariff-calculator/oeses/new']);
  }

  private deleteItem(itemId: number) {
    return this.oesService.delete(itemId);
  }
}
