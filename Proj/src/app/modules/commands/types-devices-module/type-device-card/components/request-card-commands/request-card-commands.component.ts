import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataGrid, 
         ActionButtons as DGActionButton, 
         ActionButtonConfirmSettings as DGActionButtonConfirmSettings } from '../../../../../../controls/DataGrid';
import { DeviceTypeCommandsService } from 'src/app/services/configuration/device-type-commands.service';
import { finalize } from 'rxjs/operators';
import { DeviceTypeCommand } from 'src/app/services/configuration/Models/DeviceTypeCommand';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
    selector: 'rom-request-card-commands',
    templateUrl: './request-card-commands.component.html',
    styleUrls: ['./request-card-commands.component.less'],
    providers: [DeviceTypeCommandsService]
})
export class RequestCardCommandsComponent implements OnInit {
    
    public loadingContent = true;
    public errors: any[] = [];

    deviceTypeId: number;

    @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;
    @ViewChild('cellTypeCommand', { static: false }) cellTypeCommand: TemplateRef<any>;
    @ViewChild('cellTypeChannel', { static: false }) cellTypeChannel: TemplateRef<any>;

    constructor(
        private deviceTypeCommandsService: DeviceTypeCommandsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private permissionCheckUtils: PermissionCheckUtils
    ) { 
        this.deviceTypeId = activatedRoute.parent.snapshot.params.id;
        deviceTypeCommandsService.idDeviceType = this.deviceTypeId;
    }

    ngOnInit() {
        this.loadData();
    }

    addCommand() {
        this.router.navigate([`commands-module/c/types-devices/${this.deviceTypeId}/command/new`]);
    }

    private loadData() {
        this.deviceTypeCommandsService
            .getCommands()
            .pipe(
                finalize(() => this.loadingContent = false)
            )
            .subscribe(
                (commands: DeviceTypeCommand[]) => {
                    this.initDG(commands);
                },
                error => {
                    this.errors = [error];
                },
            );
    }
    private initDG(commands: DeviceTypeCommand[]) {
        this.dataGrid.initDataGrid();

        this.dataGrid.KeyField = 'Id';
        this.dataGrid.Columns = [
            {
                Name: 'DeviceCommandType',
                AggregateFieldName: ['Name'],
                Caption: AppLocalization.TeamType,
                CellTemplate: this.cellTypeCommand
            },
            {
                Name: 'DeviceChannelType',
                AggregateFieldName: ['Name'],
                Caption: AppLocalization.ChannelType,
                CellTemplate: this.cellTypeChannel
            }
        ];
        this.permissionCheckUtils
          .getAccess([
            'CFG_DEVICE_EDIT_COMMANDS'
          ], [
            new DGActionButton(
              'Delete',
              AppLocalization.Delete,
              new DGActionButtonConfirmSettings(
                AppLocalization.DeleteConfirm,
                AppLocalization.Delete
              )
            )
          ])
          .subscribe(result => this.dataGrid.ActionButtons = result);

        this.dataGrid.DataSource = commands;
    }

    public onDGRowActionBtnClick(button: any) {
        if (button.action === 'Delete') {
            const itemId = button.item.Id;
            this.loadingContent = true;
            this.deviceTypeCommandsService
            .deleteCommand(itemId)
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
    }
}
