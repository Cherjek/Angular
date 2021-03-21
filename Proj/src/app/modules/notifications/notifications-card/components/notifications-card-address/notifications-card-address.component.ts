import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
  SelectionRowMode,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { NotificationSettingsService } from 'src/app/services/notifications/notification-settings.service';
import { AddressBookService } from 'src/app/services/notifications/address-book.service';
import { AddressBook } from 'src/app/services/commands/Models/AddressBook';
import { PermissionCheck } from 'src/app/core';

@Component({
  selector: 'rom-notifications-card-address',
  templateUrl: './notifications-card-address.component.html',
  styleUrls: ['./notifications-card-address.component.less'],
})
export class NotificationsCardAddressComponent implements OnInit, OnDestroy {
  loadingContent: boolean;
  errors: any[] = [];
  addresses: AddressBook[];
  addressFilter: AddressBook[];
  public isAdd: boolean;
  public isDelete: boolean;

  @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;

  sub$: Subscription;

  constructor(
    private notificationsSettingsService: NotificationSettingsService,
    private addressBookService: AddressBookService,
    private activatedRoute: ActivatedRoute,
    private permissionCheck: PermissionCheck
  ) {
    notificationsSettingsService.notificationId = this.activatedRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.accessInit()
      .subscribe(results => {
        this.isAdd = results[0];
        this.isDelete = results[1];
        this.initDG();
        this.loadData();
      });    
  }

  onActionButtonClicked(items: any) {
    items = Array.isArray(items) ? items : [items];
    const selectedItems = items.map(
      (x: { item: AddressBook; Data: AddressBook }) => x.item || x.Data
    );
    this.loadingContent = true;
    this.deleteItem(this.filterItems(selectedItems, this.addresses))
      .then(() => {
        this.loadData();
      })
      .catch((error: any) => {
        this.errors.push(error);
        this.loadingContent = false;
      });
  }

  addFilterItem(selectedValues: AddressBook[]) {
    this.loadingContent = true;
    this.notificationsSettingsService
      .postAddress(selectedValues.concat(this.addresses))
      .then(() => {
        this.loadData();
      })
      .catch((err) => {
        this.loadingContent = false;
        this.errors = [err];
      });
  }

  private accessInit(): Observable<boolean[]> {
    const checkAccess = [
      'ES_NTF_ADDRESSES_ADD',
      'ES_NTF_ADDRESSES_REMOVE'
    ];

    const obsrvs: any[] = [];
    checkAccess.forEach((access: string | string[]) => {
      obsrvs.push(this.permissionCheck.checkAuthorization(access));
    });

    return forkJoin<boolean>(obsrvs);
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = forkJoin([
      this.notificationsSettingsService.getAddress(),
      this.addressBookService.read(),
    ])
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (data: [AddressBook[], AddressBook[]]) => {
          this.addresses = data[0];
          this.addressFilter = this.filterItems(data[0], data[1]);
          this.dataGrid.DataSource = this.addresses;
        },
        (error) => {
          this.errors = [error];
        }
      );
  }

  private filterItems(
    addresses: AddressBook[],
    filterAddresses: AddressBook[]
  ) {
    return filterAddresses.filter(
      (filterItem) => !addresses.find((address) => address.Id === filterItem.Id)
    );
  }

  private initDG() {
    this.dataGrid.initDataGrid();
    this.dataGrid.KeyField = 'Id';
    this.dataGrid.SelectionRowMode = SelectionRowMode.Multiple;
    this.dataGrid.Columns = [
      {
        Name: 'Name',
        Caption: AppLocalization.Name,
        AppendFilter: false,
      },
      {
        Name: 'EMail',
        Caption: AppLocalization.Email,
        AppendFilter: false,
      },
      {
        Name: 'PhoneNumber',
        Caption: AppLocalization.PhoneNumber,
        AppendFilter: false,
      },
    ];

    if (this.isDelete) {
      this.dataGrid.ActionButtons = [
        new ActionButtons(
          'Delete',
          AppLocalization.Delete,
          new ActionButtonConfirmSettings(
            AppLocalization.DeleteConfirm,
            AppLocalization.Delete
          )
        ),
      ];
    }
  }

  private deleteItem(items: any[]) {
    return this.notificationsSettingsService.postAddress(items);
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
}
