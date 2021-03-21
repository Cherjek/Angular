import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataGrid,
    ActionButtons as DGActionButton, 
    ActionButtonConfirmSettings as DGActionButtonConfirmSettings } from 'src/app/controls/DataGrid';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DevicesCommandsService } from 'src/app/services/configuration/devices-commands.service';
import { IDeviceCommand } from 'src/app/services/configuration/Models/DeviceCommand';
import { PermissionCheckUtils } from 'src/app/core';



@Component({
    selector: 'rom-devices-commands',
    templateUrl: './devices-commands.component.html',
    styleUrls: ['./devices-commands.component.less'],
    providers: [DevicesCommandsService]
})
export class DevicesCommandsComponent implements OnInit {

    public loadingContent = true;
    public errors: any[] = [];

    commandId: number;
    idLogicDevice: number;

    @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;
    @ViewChild('cellDeviceParam', { static: false }) public cellDeviceParam: TemplateRef<any>;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private devicesCommandsService: DevicesCommandsService,
        private permissionCheckUtils: PermissionCheckUtils
    ) { 
        this.commandId = this.activatedRoute.parent.snapshot.params.id;
        this.idLogicDevice = this.activatedRoute.parent.snapshot.params.idLogicDevice;

        devicesCommandsService.idLogicDeviceCommand = this.commandId;
    }

    ngOnInit() {
        this.loadData();
    }

    addParametr() {
        // commands-module/logic-device/:idLogicDevice/logic-device-command/:idLogicDeviceCommand/device-command/:id
        this.router.navigate([`commands-module/logic-device/${this.idLogicDevice}/logic-device-command/${this.commandId}/device-command/new`]);
    }

    private loadData() {
        this.devicesCommandsService
            .getDevicesCommands()
            .pipe(
                finalize(() => this.loadingContent = false)
            )
            .subscribe(
                (commands: IDeviceCommand[]) => {
                    this.initDG(commands);
                },
                error => {
                    this.errors = [error];
                },
            );
    }

    private initDG(commands: IDeviceCommand[]) {
        this.dataGrid.initDataGrid();

        this.dataGrid.KeyField = 'Id';
        this.dataGrid.Columns = [
            {
                Name: 'Device',
                AggregateFieldName: ['DisplayName'],
                Caption: AppLocalization.Device,
                CellTemplate: this.cellDeviceParam
            },
            {
                Name: 'DeviceTypeCommandText',
                Caption: AppLocalization.TeamDevice
            }
        ];

        this.permissionCheckUtils
          .getAccess([
            'OE_DELETE_DEVICE_COMMAND'
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

        this.dataGrid.DataSource = commands.map(x =>  { 
            if (x.DeviceTypeCommand && x.DeviceTypeCommand.DeviceCommandType) {
                x['DeviceTypeCommandText'] = x.DeviceTypeCommand.DeviceCommandType.Name;
            }
            return x;
        });
    }

    public onDGRowActionBtnClick(button: any) {
        if (button.action === 'Delete') {
            this.loadingContent = true;
            this.devicesCommandsService
                .deleteDeviceCommand(button.item.Id)
                .then((result: any) => {
                    this.loadData();
                })
                .catch((error: any) => {
                    this.loadingContent = false;
                    this.errors = [error];
                });
        }
    }
}
