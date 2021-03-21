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
import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';
import { ISubPersonalAccount } from 'src/app/services/sub-personal-account/models/SubPersonalAccount';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-pa-applications-main',
  templateUrl: './pa-applications-main.component.html',
  styleUrls: ['./pa-applications-main.component.less'],
})
export class PaApplicationsMainComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public apps: ISubPersonalAccount[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('typeNameColumnTemplate', { static: true })
  private typeNameColumnTemplate: TemplateRef<any>;
  @ViewChild('hierarchyColumnTemplate', { static: true })
  private hierarchyColumnTemplate: TemplateRef<any>;
  sub$: Subscription;

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private subPersonalAccountMainService: SubPersonalAccountService,
    private router: Router
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
    this.sub$ = this.subPersonalAccountMainService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (apps: any) => {
          this.apps = apps;
          this.initDG();
        },
        (error: any) => {
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
      {
        Name: 'Hierarchy',
        Caption: AppLocalization.Hierarchy,
        AppendFilter: false,
        disableTextWrap: true,
        CellTemplate: this.hierarchyColumnTemplate,
      },
    ];

    this.permissionCheckUtils
      .getAccess(
        ['CPA_DELETE_APP'],
        [
          new ActionButtons(
            'Delete',
            AppLocalization.Delete,
            new ActionButtonConfirmSettings(
              AppLocalization.DeleteConfirm,
              AppLocalization.Delete
            )
          ),
        ]
      )
      .subscribe((result) => this.dataGrid.ActionButtons = result);

    this.dataGrid.DataSource = this.apps;
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
    this.router.navigate(['sub-personal-account/apps/new']);
  }

  private deleteItem(itemId: number) {
    return this.subPersonalAccountMainService.delete(itemId);
  }
}
