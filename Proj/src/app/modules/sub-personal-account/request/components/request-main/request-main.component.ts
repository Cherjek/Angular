import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { 
  ActionButtonConfirmSettings, 
  ActionButtons, 
  DataGrid, 
  SelectionRowMode, 
  DataColumnType  
} from 'src/app/controls/DataGrid';
import { PermissionCheckUtils } from 'src/app/core';
import { RequestsDefFiltersService } from 'src/app/services/sub-personal-account/requests/Filters/RequestsDefFilters.service';
import { RequestsFilterContainerService } from 'src/app/services/sub-personal-account/requests/Filters/RequestsFilterContainer.service';
import { RequestService } from 'src/app/services/sub-personal-account/requests/request.service';

@Component({
  selector: 'app-request-main',
  templateUrl: './request-main.component.html',
  styleUrls: ['./request-main.component.less']
})
export class RequestMainComponent implements OnInit, OnDestroy {

  public loadingContent: boolean;
  public errors: any[] = [];
  public requests: any[] = [];
  groupConfirm = false;
  groupDeny = false;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('linkTemplate', { static: true })
  private linkTemplate: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true })
  private statusTemplate: TemplateRef<any>;
  @ViewChild('fioTemplate', { static: true })
  private fioTemplate: TemplateRef<any>;
  @ViewChild('customPhoneTemplate', { static: true })
  private customPhoneTemplate: TemplateRef<any>;
  @ViewChild('customEmailTemplate', { static: true })
  private customEmailTemplate: TemplateRef<any>;
  @ViewChild('customStatusTemplate', { static: true })
  private customStatusTemplate: TemplateRef<any>;
  sub$: Subscription;
  private filterKey: string;

  constructor(
    private requestService: RequestService,
    private permissionCheckUtils: PermissionCheckUtils,
    public requestsFilterContainerService: RequestsFilterContainerService,
    private requestsDefFiltersService: RequestsDefFiltersService,
    private router: Router) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  public onApplyFilter(guid: string): void {
    this.filterKey = guid;
    this.loadData();
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = this.requestsDefFiltersService
      .getRequests(this.filterKey)
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (requests: any[]) => {
          this.requests = (requests || []).map(x => {
            if (x['Customer']) {
              x['Customer']['FIO'] = `${x.Customer.Surname} ${x.Customer.FirstName} ${x.Customer.MiddleName}`;
            }            
            return x;
          });
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
    this.dataGrid.SelectionRowMode = SelectionRowMode.Multiple;

    this.dataGrid.Columns = [
      {
        Name: 'Application',
        AggregateFieldName: ['Name'],
        Caption: AppLocalization.Application,
        CellTemplate: this.linkTemplate,
        AppendFilter: false,
        disableTextWrap: true
      }, {
        Name: 'Status',
        AggregateFieldName: ['Name'],
        Caption: AppLocalization.Status,
        CellTemplate: this.statusTemplate,
        AppendFilter: false,
        disableTextWrap: true
      }, {
        Name: 'DateTime',
        Caption: AppLocalization.DateTime,
        DataType: DataColumnType.DateTime,
        Width: 200
      }, {
        Name: 'Customer',
        AggregateFieldName: ['Surname','FirstName','MiddleName'],
        Caption: AppLocalization.FIO,
        CellTemplate: this.fioTemplate,
        AppendFilter: false,
        disableTextWrap: true
      }, {
        Name: 'Customer',
        AggregateFieldName: ['PhoneNumber'],
        Caption: AppLocalization.Phone,
        CellTemplate: this.customPhoneTemplate,
        AppendFilter: false,
        disableTextWrap: true
      }, {
        Name: 'Customer',
        AggregateFieldName: ['Email'],
        Caption: AppLocalization.Email,
        CellTemplate: this.customEmailTemplate,
        AppendFilter: false,
        disableTextWrap: true
      }, {
        Name: 'Customer',
        Caption: AppLocalization.CustomerStatus,
        CellTemplate: this.customStatusTemplate
      },
    ];
    
    this.permissionCheckUtils
      .getAccess(
        [
          'CPA_ACCEPT_REQUEST',
          'CPA_REJECT_REQUEST'
        ],
        [
          {...new ActionButtons(
            'Confirm',
            AppLocalization.Confirm,
            new ActionButtonConfirmSettings(
              AppLocalization.QuestionConfirm,
              AppLocalization.Confirm
            )
          ), ...{ 
            IsValid: (data: any) => {
              return data.Status.Id === 1;
            }
           }},
          {...new ActionButtons(
            'Deny',
            AppLocalization.Deny,
            new ActionButtonConfirmSettings(
              AppLocalization.QuestionDeny,
              AppLocalization.Deny
            )            
          ), ...{ 
            IsValid: (data: any) => {
              return data.Status.Id === 1;
            }
           }},
        ]
      )
      .subscribe((result) => {
        this.dataGrid.ActionButtons = result;
        this.groupConfirm = result.some(x => x.Name === 'Confirm');
        this.groupDeny = result.some(x => x.Name === 'Deny');
      });

    this.dataGrid.DataSource = this.requests;
  }

  onActionButtonClicked(event: any) {
    const itemId = event.item.Id;
    if (event.action === 'Confirm') {
      this.confirmRequest([itemId]);
    } else if (event.action === 'Deny') {
      this.denyRequest([itemId]);
    }
  }

  private getSelectedRows() {
    return this.dataGrid.getSelectDataRows().map(item => item[this.dataGrid.KeyField]);
  }

  private validate() {
    const statusesIds = this.dataGrid.getSelectDataRows().map(x => x.Status.Id);
    if (!statusesIds.every(x => x === 1)) {      
      this.errors = [AppLocalization.SelectedStatusesWrong];
      throw new Error(AppLocalization.SelectedStatusesWrong);      
    }
  }

  deny() {
    this.validate();
    this.denyRequest(this.getSelectedRows());
  }

  denyRequest(items: number[]) {
    const obj = {} as any;
    obj.idRequests = items;
    this.loadingContent = true;    
    this.request(this.requestService
      .rejectRequest(obj));
  }

  confirm() {
    this.validate();
    this.confirmRequest(this.getSelectedRows());
  }

  confirmRequest(items: number[]) {
    this.request(
      this.requestService
      .acceptRequest(items));
  }

  request(promise: Promise<Object>) {
    this.loadingContent = true;  
    promise
      .then(() => {
        this.loadData();
        this.loadingContent = false;
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  export() {

  }
}
