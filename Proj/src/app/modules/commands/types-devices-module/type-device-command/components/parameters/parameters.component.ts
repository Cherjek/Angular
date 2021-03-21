import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, Input } from '@angular/core';
import { DataGrid,
    ActionButtons as DGActionButton, 
    ActionButtonConfirmSettings as DGActionButtonConfirmSettings } from 'src/app/controls/DataGrid';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceTypeCommandParameterService } from 'src/app/services/configuration/device-type-command-parameter.service';
import { finalize } from 'rxjs/operators';
import { IDeviceTypeCommandParameter } from 'src/app/services/configuration/Models/DeviceTypeCommandParameter';
import { Subscription } from 'rxjs';
import { LogicDeviceTypeCommandParameterService } from 'src/app/services/commands/Configuration/logic-device-type-command-parameter.service';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
    selector: 'rom-parameters',
    templateUrl: './parameters.component.html',
    styleUrls: ['./parameters.component.less'],
    providers: [DeviceTypeCommandParameterService]
})
export class ParametersComponent implements OnInit, OnDestroy {

    public loadingContent = true;
    public errors: any[] = [];

    commandId: number;
    idDeviceType: number;
    deviceService: DeviceTypeCommandParameterService | LogicDeviceTypeCommandParameterService;

    @Input() permission = 'CFG_DEVICE_EDIT_COMMANDS';

    @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;
    @ViewChild('cellNameParam', { static: false }) public cellNameParam: TemplateRef<any>;
    @ViewChild('cellValueParam', { static: false }) public cellValueParam: TemplateRef<any>;
    sub$: Subscription;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        deviceTypeCommandParameterService: DeviceTypeCommandParameterService,
        logicDeviceTypeCommandParameterService: LogicDeviceTypeCommandParameterService,
        private permissionCheckUtils: PermissionCheckUtils
    ) { 
        this.deviceService = this.isDeviceType()
            ? deviceTypeCommandParameterService : logicDeviceTypeCommandParameterService;
        this.commandId = this.activatedRoute.parent.snapshot.params.id;
        this.idDeviceType = this.activatedRoute.parent.snapshot.params.idDeviceType;
        this.deviceService.idDeviceType = this.idDeviceType;
        this.deviceService.idDeviceTypeCommand = this.commandId;
    }

    ngOnInit() {
        this.loadData();
    }

    ngOnDestroy() {
        if (this.sub$) {
            this.sub$.unsubscribe();
        }
    }
    addParameter() {
        this.isDeviceType()
        ? this.router.navigate([`commands-module/p/types-devices/${this.idDeviceType}/command/${this.commandId}/parameters/new`])
        : this.router.navigate([`commands-module/p/types-commands-logic-devices/${this.commandId}/parameters/new`]);
    }

    private loadData() {
        this.sub$ = (this.deviceService  as any)
            .getParameters()
            .pipe(
                finalize(() => this.loadingContent = false)
            )
            .subscribe(
                (parameters: IDeviceTypeCommandParameter[]) => {
                    this.initDG(parameters);
                },
                (error: any) => {
                    this.errors = [error];
                },
            );
    }
    private initDG(parameters: IDeviceTypeCommandParameter[]) {
        this.dataGrid.initDataGrid();

        this.dataGrid.KeyField = 'Id';
        this.dataGrid.Columns = [
            {
                Name: 'Name',
                Caption: AppLocalization.Name,
                CellTemplate: this.cellNameParam
            },
            {
                Name: 'DefaultValue',
                Caption: AppLocalization.DefaultValue
            },
            {
                Name: 'ValueType',
                AggregateFieldName: ['Name'],
                Caption: AppLocalization.Value,
                CellTemplate: this.cellValueParam
            }
        ];

        if (!this.isDeviceType()) {
            this.dataGrid.Columns.splice(1, 1);
        }

        this.permissionCheckUtils
          .getAccess([
            this.permission
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

        this.dataGrid.DataSource = parameters;
    }

    isDeviceType() {
        return this.router.url.includes('types-devices');
    }

    public onDGRowActionBtnClick(button: any) {
        if (button.action === 'Delete') {
            const itemId = button.item.Id;
            this.loadingContent = true;
            this.deviceService
            .deleteParameter(itemId)
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
