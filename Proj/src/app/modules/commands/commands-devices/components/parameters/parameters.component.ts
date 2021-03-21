import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { DataGrid,
    ActionButtons as DGActionButton, 
    ActionButtonConfirmSettings as DGActionButtonConfirmSettings } from 'src/app/controls/DataGrid';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeviceCommandParametersService } from 'src/app/services/configuration/device-command-parameters.service';
import { finalize } from 'rxjs/operators';
import { IDeviceCommandParameter } from 'src/app/services/configuration/Models/DeviceCommandParameter';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
    selector: 'rom-parameters',
    templateUrl: './parameters.component.html',
    styleUrls: ['./parameters.component.less']
})
export class ParametersComponent implements OnInit, OnDestroy {

    public loadingContent = true;
    public errors: any[] = [];
    sub$: Subscription;

    commandId: number;
    idLogicDevice: number;
    idLogicDeviceCommand: number;

    urlEdit: string;

    @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;
    @ViewChild('cellNameParam', { static: false }) public cellNameParam: TemplateRef<any>;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private deviceCommandParametersService: DeviceCommandParametersService,
        private permissionCheckUtils: PermissionCheckUtils
    ) { 
        this.commandId = this.activatedRoute.parent.snapshot.params.id;
        this.idLogicDevice = this.activatedRoute.parent.snapshot.params.idLogicDevice;
        this.idLogicDeviceCommand = this.activatedRoute.parent.snapshot.params.idLogicDeviceCommand;

        this.urlEdit = `/commands-module/logic-device/${this.idLogicDevice}/logic-device-command/${this.idLogicDeviceCommand}/device-command/${this.commandId}`;

        deviceCommandParametersService.idDeviceCommand = this.commandId;
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
        const url = `commands-module/device-type-parameters/${this.idLogicDevice}/${this.idLogicDeviceCommand}/${this.commandId}`;
        this.router.navigate([url]);
    }

    private loadData() {
        this.sub$ = this.deviceCommandParametersService.getParameters()
            .pipe(
                finalize(() => this.loadingContent = false)
            )
            .subscribe(
                (parameters: IDeviceCommandParameter[]) => {
                    this.initDG(parameters.map(x => {
                        
                        x['__typeValue'] = x.FixedValue != null ? AppLocalization.FixedValue :
                            x.LogicDeviceParameter != null ? AppLocalization.EquipmentCommandOption :
                            AppLocalization.DefaultValue;

                        x['__value'] = x.FixedValue != null ? x.FixedValue :
                                    x.LogicDeviceParameter != null ? x.LogicDeviceParameter.Name :
                                    x.DeviceParameter.DefaultValue;

                        return x;
                    }));
                },
                (error: any) => {
                    this.errors = [error];
                },
            );
    }

    private initDG(parameters: IDeviceCommandParameter[]) {
        this.dataGrid.initDataGrid();

        this.dataGrid.KeyField = 'Id';
        this.dataGrid.Columns = [
            {
                Name: 'DeviceParameter',
                AggregateFieldName: ['Name'],
                Caption: AppLocalization.DeviceTeamSetting,
                CellTemplate: this.cellNameParam
            },
            {
                Name: '__typeValue',
                Caption: AppLocalization.ParameterType
            },
            {
                Name: '__value',
                Caption: AppLocalization.Value,
            }
        ];

        this.dataGrid.ActionButtons = [
            new DGActionButton(
                'Delete',
                AppLocalization.Delete,
                new DGActionButtonConfirmSettings(AppLocalization.DeleteConfirm, AppLocalization.Delete),
            ),
        ];
        this.permissionCheckUtils
          .getAccess([
            'OE_EDIT_DEVICE_COMMAND'
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

    public onDGRowActionBtnClick(button: any) {
        if (button.action === 'Delete') {
            const itemId = button.item.Id;
            this.loadingContent = true;
            this.deviceCommandParametersService
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
