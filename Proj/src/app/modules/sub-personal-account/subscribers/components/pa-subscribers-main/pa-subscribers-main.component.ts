import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  DataGrid,
  DataColumnType,
  ActionButtons,
  ActionButtonConfirmSettings,
  SelectionRowMode as DGSelectionRowMode,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';
import { ContextButtonItem } from '../../../../../controls/ContextButton/ContextButtonItem';

import { Router } from '@angular/router';
import { SubPersonalFilterContainerService } from 'src/app/services/sub-personal-account/filters-main/SubPersonalFilterContainer.service';
import { PaSubscriberCardService } from 'src/app/services/sub-personal-account/pa-subscriber-card.service';
import { SubscribersMainService } from 'src/app/services/sub-personal-account/subscribers-main.service';
import { ICustomer } from 'src/app/services/sub-personal-account/models/Customer';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-pa-subscribers-main',
  templateUrl: './pa-subscribers-main.component.html',
  styleUrls: ['./pa-subscribers-main.component.less'],
})
export class PaSubscribersMainComponent implements OnInit {
  public menuConfirmItem: any = null;
  public loadingContent: boolean;
  public errors: any[] = [];
  public dataSource: ICustomer[];
  public filterKey: string;
  public commandActions: ContextButtonItem[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('cellColumnTemplate', { static: true })
  private cellColumnTemplate: TemplateRef<any>;
  @ViewChild('statusColumnTemplate', { static: true })
  private statusColumnTemplate: TemplateRef<any>;
  @ViewChild('userColumnTemplate', { static: true })
  private userColumnTemplate: TemplateRef<any>;
  private dgSelectionRowMode = DGSelectionRowMode;

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    public paSubCardService: PaSubscriberCardService,
    public subPersonalFilterContainerService: SubPersonalFilterContainerService,
    private subMainService: SubscribersMainService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContent = true;
    this.subMainService
      .getSubscribers(this.filterKey)
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (customers: ICustomer[]) => {
          this.dataSource = customers;
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
    this.dataGrid.SelectionRowMode = this.dgSelectionRowMode.Multiple;

    this.dataGrid.Columns = [
      {
        Name: 'Application',
        Caption: AppLocalization.PersonalAppName,
        CellTemplate: this.cellColumnTemplate,
      },
      {
        Name: 'Surname',
        Caption: AppLocalization.Surname,
        CellTemplate: this.userColumnTemplate,
      },
      {
        Name: 'FirstName',
        Caption: AppLocalization.PersonName,
      },
      {
        Name: 'MiddleName',
        Caption: 'Отчество',
      },
      {
        Name: 'PhoneNumber',
        Caption: AppLocalization.PhoneNumber,
      },
      {
        Name: 'Email',
        Caption: AppLocalization.Email,
      },
      {
        Name: 'Status',
        Caption: AppLocalization.Status,
        CellTemplate: this.statusColumnTemplate,
      },
      {
        Name: 'RegistrationDateTime',
        Caption: AppLocalization.RegistrationDate,
        DataType: DataColumnType.DateTime,
      },
      {
        Name: 'LastVisitDateTime',
        Caption: AppLocalization.LastSeenDate,
        DataType: DataColumnType.DateTime,
      },
    ];

    this.dataGrid.DataSource = this.dataSource;
    this.commandActions = [
      { code: 'export', name: AppLocalization.Export }
    ];

    this.permissionCheckUtils
      .getAccess(
        [
          'CPA_DELETE_CUSTOMER',
          'CPA_ACTIVATE_CUSTOMER',
          'CPA_BLOCK_CUSTOMER'          
        ],
        [
          new ActionButtons(
            'Delete',
            AppLocalization.Delete,
            new ActionButtonConfirmSettings(
              AppLocalization.ConfirmCustomerDelete,
              AppLocalization.Delete
            )
          ),
          new ActionButtons(
            'active',
            AppLocalization.Activate,
            new ActionButtonConfirmSettings(
              AppLocalization.ConfirmCustomerActivate,
              AppLocalization.Activate
            )
          ),
          new ActionButtons(
            'deactive',
            AppLocalization.Block,
            new ActionButtonConfirmSettings(
              AppLocalization.ConfirmCustomerBlock,
              AppLocalization.Block
            )
          ),
        ]
      )
      .subscribe((result) => this.dataGrid.ActionButtons = result);
    
    this.permissionCheckUtils
        .getAccess(
          [
            'CPA_DELETE_CUSTOMER',
            'CPA_ACTIVATE_CUSTOMER',
            'CPA_BLOCK_CUSTOMER'          
          ],
          [
            { code: 'delete', name: AppLocalization.Delete },
            { code: 'active', name: AppLocalization.Activate },
            { code: 'deactive', name: AppLocalization.Block }          
          ]
        )
        .subscribe((result) => this.commandActions = [...result, ...this.commandActions]);
  }

  addNewSchedule() {
    this.router.navigate(['sub-personal-account/subscribers/new']);
  }

  onActionButtonClicked(event: any) {
    const itemId = event.item.Id;
    if (event.action === 'delete') {
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
    } else {
      let request;
      if (event.action === 'active' || event.action === 'deactive') {
        request =
          event.action === 'active'
            ? this.paSubCardService.activateCustomers([itemId])
            : this.paSubCardService.blockCustomer([itemId]);
      }
      if (request) {
        this.loadingContent = true;
        request
          .then(() => {
            this.loadingContent = false;
            this.loadData();
          })
          .catch((error: any) => {
            this.errors.push(error);
            this.loadingContent = false;
          });
      }
    }
  }

  private deleteItem(itemId: number) {
    return this.paSubCardService.delete([itemId]);
  }

  onApplyFilter(guid: string): void {
    this.filterKey = guid;
    this.loadData();
  }

  itemActionEvent(action: any) {
    let request;
    const ids = (this.dataGrid.getSelectRows() || []).map((x) => x.Data.Id);
    if (action.code === 'active') {
      request = this.paSubCardService.activateCustomers(ids);
    } else if (action.code === 'deactive') {
      request = this.paSubCardService.blockCustomer(ids);
    } else if (action.code === 'delete') {
      request = this.paSubCardService.delete(ids);
    } else if (action.code === 'export') {
      this.dataGrid.exportToExcel();
      return;
    }
    if (request) {
      this.loadingContent = true;
      request
        .then(() => {
          this.loadingContent = false;
          this.loadData();
        })
        .catch((error: any) => {
          this.errors.push(error);
          this.loadingContent = false;
        });
    }
  }
}
