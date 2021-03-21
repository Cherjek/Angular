import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DataGrid,
    ActionButtons as DGActionButton, 
    ActionButtonConfirmSettings as DGActionButtonConfirmSettings } from 'src/app/controls/DataGrid';
import { LogicDeviceCommandsService } from 'src/app/services/configuration/logic-device-commands.service';
import { ILogicDeviceCommand } from 'src/app/services/configuration/Models/LogicDeviceCommand';
import { Subscription } from 'rxjs';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
    selector: 'rom-commands',
    templateUrl: './commands.component.html',
    styleUrls: ['./commands.component.less'],
    providers: [LogicDeviceCommandsService]
})
export class CommandsComponent implements OnInit, OnDestroy {

    public loadingContent = true;
    public errors: any[] = [];
    idLogicDevice: number;

    @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;
    @ViewChild('cellNameCommand', { static: false }) public cellNameCommand: TemplateRef<any>;
    data$: Subscription;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private logicDeviceCommandsService: LogicDeviceCommandsService,
        private permissionCheckUtils: PermissionCheckUtils) { 
        this.idLogicDevice = this.activatedRoute.parent.snapshot.params.id;

        logicDeviceCommandsService.idLogicDevice = this.idLogicDevice;
    }

    ngOnInit() {
        this.loadData();
    }

    ngOnDestroy() {
        if (this.data$) {
          this.data$.unsubscribe();
        }
    }

    addCommand() {
        this.router.navigate([`commands-module/logic-device/${this.idLogicDevice}/command-create`]);
    }

    onDGRowActionBtnClick(button: any) {
        if (button.action === 'Delete') {
            this.delete(button.item);
        }
    }

    private loadData() {
        this.data$ = this.logicDeviceCommandsService
            .getLogicDeviceCommands()
            .pipe(
                finalize(() => this.loadingContent = false)
            )
            .subscribe(
                (commands: ILogicDeviceCommand[]) => {
                    this.initDG(commands);
                },
                error => {
                    this.errors = [error];
                },
            );
    }

    private initDG(commands: ILogicDeviceCommand[]) {
        this.dataGrid.initDataGrid();

        this.dataGrid.KeyField = 'Id';
        this.dataGrid.Columns = [
            {
                Name: 'CommandType',
                AggregateFieldName: ['Name'],
                Caption: AppLocalization.Name,
                CellTemplate: this.cellNameCommand
            },
            {
                Name: 'Description',
                Caption: AppLocalization.Description
            }
        ];
        this.permissionCheckUtils
          .getAccess([
            'OE_DELETE_COMMAND'
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

    private delete(command: ILogicDeviceCommand) {
        this.loadingContent = true;
        this.logicDeviceCommandsService.deleteLogicDeviceCommand(command.Id)
            .then(
            (result: any) => {
                if (result === 0) {
                    this.loadData();
                }
            }).catch(
                (error: any) => {
                    this.loadingContent = false;
                    this.errors = [error];
                });
    }
}
