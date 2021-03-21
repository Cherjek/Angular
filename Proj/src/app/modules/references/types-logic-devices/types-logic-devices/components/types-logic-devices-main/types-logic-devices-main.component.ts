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
import { IDeviceType } from 'src/app/services/data-query';
import { LogicDeviceTypesService } from 'src/app/services/configuration/logic-device-types.service';
import { Subscription } from 'rxjs';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-types-logic-devices-main',
  templateUrl: './types-logic-devices-main.component.html',
  styleUrls: ['./types-logic-devices-main.component.less']
})
export class TypesLogicDevicesMainComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public deviceTypes: IDeviceType[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('typeNameColumnTemplate', { static: true })
  private typeNameColumnTemplate: TemplateRef<any>;
  sub$: Subscription;

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private logicDeviceTypesService: LogicDeviceTypesService,
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
    this.sub$ = this.logicDeviceTypesService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (deviceTypes: IDeviceType[]) => {
          this.deviceTypes = deviceTypes;
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
        Name: 'Name',
        Caption: AppLocalization.Name,
        CellTemplate: this.typeNameColumnTemplate,
        AppendFilter: false,
        disableTextWrap: true
      },
      {
        Name: 'Code',
        Caption: AppLocalization.Code,
        AppendFilter: false,
        disableTextWrap: true
      }
    ];
    
    this.permissionCheckUtils
          .getAccess([
            'CFG_LOGIC_DEVICE_EDIT'
          ], [
            new ActionButtons(
              'Delete',
              AppLocalization.Delete,
              new ActionButtonConfirmSettings(
                AppLocalization.DeleteConfirm,
                AppLocalization.Delete
              )
            )
          ])
          .subscribe(result => this.dataGrid.ActionButtons = result);

    this.dataGrid.DataSource = this.deviceTypes;
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

  addNewDevice() {
    this.router.navigate(['references/types-logic-devices/new']);
  }

  private deleteItem(itemId: number) {
    return this.logicDeviceTypesService.delete(itemId);
  }
}
