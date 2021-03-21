import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';
import { LogicDeviceKindsService } from 'src/app/services/references/logic-device-kinds.service';
import { LogicDeviceKind } from 'src/app/services/references/models/LogicDeviceKinds';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-types-logic-devices-card-kind',
  templateUrl: './types-logic-devices-card-kind.component.html',
  styleUrls: ['./types-logic-devices-card-kind.component.less']
})
export class TypesLogicDevicesCardKindComponent implements OnInit {
  public loadingContent: boolean;
  public errors: any[] = [];
  public deviceTypes: LogicDeviceKind[];
  logicDeviceId: number;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('typeNameColumnTemplate', { static: true })
  private typeNameColumnTemplate: TemplateRef<any>;

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private logicDeviceKindsService: LogicDeviceKindsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const paramId = this.activatedRoute.parent.snapshot.params.id;
    logicDeviceKindsService.idLogicDevice = paramId;
    this.logicDeviceId = paramId;
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContent = true;
    this.logicDeviceKindsService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (deviceKinds: LogicDeviceKind[]) => {
          this.deviceTypes = deviceKinds;
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
            'CFG_LOGIC_DEVICE_EDIT_KINDS'
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
        this.dataGrid.DataSource = this.dataGrid.DataSource.filter(
          item => item.Id !== itemId
        );
        this.loadingContent = false;
      })
      .catch((error: any) => {
        this.errors.push(error);
        this.loadingContent = false;
      });
  }

  addNewDevice() {
    this.router.navigate([
      `references/types-logic-devices/${this.logicDeviceId}/kinds/new`
    ]);
  }

  private deleteItem(itemId: number) {
    return this.logicDeviceKindsService.deleteDeviceKind(itemId);
  }
}
