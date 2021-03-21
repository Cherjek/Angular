import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeviceCommandParameterOptionsService } from 'src/app/services/configuration/device-command-parameter-options.service';
import { finalize } from 'rxjs/operators';
import { IDeviceCommandParameterOption } from 'src/app/services/configuration/Models/DeviceCommandParameterOption';
import { DataGrid,
    ActionButtons as DGActionButton, 
    ActionButtonConfirmSettings as DGActionButtonConfirmSettings } from 'src/app/controls/DataGrid';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
    selector: 'rom-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.less']
})
export class OptionsComponent implements OnInit, OnDestroy {

    parameterId: number;
    idLogicDevice: number;
    idLogicDeviceCommand: number;
    idDeviceCommand: number;

    public loadingContent = true;
    public errors: any[] = [];
    sub$: Subscription;
    
    @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;
    @ViewChild('cellNameOption', { static: false }) cellNameOption: TemplateRef<any>;
    
    constructor(
        private permissionCheckUtils: PermissionCheckUtils,
        private deviceCommandParameterOptionsService: DeviceCommandParameterOptionsService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {

        this.parameterId = this.activatedRoute.parent.snapshot.params.id;
        this.idLogicDevice = this.activatedRoute.parent.snapshot.params.idLogicDevice;
        this.idLogicDeviceCommand = this.activatedRoute.parent.snapshot.params.idLogicDeviceCommand;
        this.idDeviceCommand = this.activatedRoute.parent.snapshot.params.idDeviceCommand;

        deviceCommandParameterOptionsService.idDeviceCommandParameter = this.parameterId;
    }

    ngOnInit() {
        this.loadData();
    }

    ngOnDestroy() {
        if (this.sub$) {
            this.sub$.unsubscribe();
        }
    }

    addOption() {
        this.router.navigate([`commands-module/device-command-parameter-option-create/${this.parameterId}`]);
    }

    private loadData() {
        this.sub$ = this.deviceCommandParameterOptionsService.getOptions()
            .pipe(
                finalize(() => this.loadingContent = false)
            )
            .subscribe(
                (options: IDeviceCommandParameterOption[]) => {
                    this.initDG(options.map(x => {
                        
                        x['__typeValue'] = x.FixedValue != null ? AppLocalization.FixedValue :
                            x.DeviceOption != null ? AppLocalization.TeamOptionToDevice :
                            AppLocalization.NotDefine;

                        x['__value'] = x.FixedValue != null ? x.FixedValue :
                                    x.DeviceOption != null ? x.DeviceOption.Text :
                                    (AppLocalization.NotDefine+'о');

                        return x;
                    }));
                },
                (error: any) => {
                    this.errors = [error];
                },
            );
    }

    private initDG(parameters: IDeviceCommandParameterOption[]) {
        this.dataGrid.initDataGrid();

        this.dataGrid.KeyField = 'Id';
        this.dataGrid.Columns = [
            {
                Name: 'LogicDeviceOption',
                AggregateFieldName: ['Text'],
                Caption: AppLocalization.ChooseCollection,
                CellTemplate: this.cellNameOption
            },
            {
                Name: '__typeValue',
                Caption: AppLocalization.ValueType
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
            this.deviceCommandParameterOptionsService
                .deleteOption(itemId)
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
