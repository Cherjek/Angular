import { Component, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { IAppDocumentType } from 'src/app/services/sub-personal-account/models/app-document-type';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-pa-applications-card-doc-types',
  templateUrl: './pa-applications-card-doc-types.component.html',
  styleUrls: ['./pa-applications-card-doc-types.component.less'],
})
export class PaApplicationsCardDocTypesComponent implements OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public docs: IAppDocumentType[];
  public appId: string;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('typeNameColumnTemplate', { static: true })
  private typeNameColumnTemplate: TemplateRef<any>;
  @ViewChild('directionColumnTemplate', { static: true })
  private directionColumnTemplate: TemplateRef<any>;
  sub$: Subscription;
  route$: Subscription;

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private subPersonalAccountMainService: SubPersonalAccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.route$ = this.activatedRoute.parent.params.subscribe((param) => {
      this.appId = param.id;
      this.loadData();
    });
  }

  ngOnDestroy() {
    this.unsubscriber([this.sub$, this.route$]);
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = this.subPersonalAccountMainService
      .getDocumentTypes(this.appId)
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (apps: any) => {
          this.docs = apps;
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
        Name: 'Направление передачи',
        Caption: AppLocalization.TransferDirection,
        AppendFilter: false,
        disableTextWrap: true,
        CellTemplate: this.directionColumnTemplate,
      },
    ];
    
    this.permissionCheckUtils
      .getAccess(
        ['CPA_EDIT_APP_DOCUMENT_TYPES'],
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

    this.dataGrid.DataSource = this.docs;
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
    this.router.navigate([
      `sub-personal-account/apps/${this.appId}/doc-types/new`,
    ]);
  }

  private deleteItem(itemId: number) {
    return this.subPersonalAccountMainService.deleteDocumentType(
      this.appId,
      itemId
    );
  }

  private unsubscriber(subs: Subscription[]) {
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
