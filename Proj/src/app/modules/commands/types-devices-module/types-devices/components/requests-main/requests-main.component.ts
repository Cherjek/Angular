import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  DataGrid,
  ActionButtons as ActionButton,
  ActionButtonConfirmSettings as ActionButtonConfirmSettings
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { DataQuerySettingsService, IDeviceType } from '../../../../../../services/data-query';
import { Router } from '@angular/router';
import { PermissionCheckUtils } from 'src/app/core';
import { DeviceTypesService } from 'src/app/services/commands/Configuration/device-types.service';

@Component({
    selector: 'rom-requests-main',
    templateUrl: './requests-main.component.html',
    styleUrls: ['./requests-main.component.less'],
    providers: [DeviceTypesService]
})
export class RequestsMainComponent implements OnInit {

    public loadingContent: boolean;
    public errors: any[] = [];
    public deviceTypes: IDeviceType[];

    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
    @ViewChild('typeNameColumnTemplate', { static: true })
    private typeNameColumnTemplate: TemplateRef<any>;

    constructor(
      private deviceTypesService: DeviceTypesService,
      private dataQuerySettingsService: DataQuerySettingsService,
      private permissionCheckUtils: PermissionCheckUtils,
      private router: Router) { }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.loadingContent = true;
        this.dataQuerySettingsService
            .getDeviceTypes()
            .pipe(
                finalize(() => this.loadingContent = false)
            )
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

    addNewDevice() {
        this.router.navigate(['commands-module/types-devices/new']);
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
            'CFG_DEVICE_EDIT'
          ], [
            new ActionButton(
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

    public onDGRowActionBtnClick(button: any) {
      if (button.action === 'Delete') {
        const itemId = button.item.Id;
        this.loadingContent = true;
        this.deviceTypesService
          .delete(itemId)
          .then(() => {
            this.dataGrid.DataSource = this.dataGrid.DataSource.filter(
              item => item.Id !== itemId
            );
            this.loadingContent = false;
          })
          .catch((error: any) => {
            this.errors = [error];
            this.loadingContent = false;
          });
      }
    }
}
