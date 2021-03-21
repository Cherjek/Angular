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
  ActionButtons as DGActionButton,
  ActionButtonConfirmSettings as DGActionButtonConfirmSettings
} from 'src/app/controls/DataGrid';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DeviceTypeCommandParameterOptionService } from 'src/app/services/configuration/device-type-command-parameter-option.service';
import { IDeviceTypeCommandParameterOption } from 'src/app/services/configuration/Models/DeviceTypeCommandParameterOption';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-parameter-options',
  templateUrl: './parameter-options.component.html',
  styleUrls: ['./parameter-options.component.less']
})
export class ParameterOptionsComponent implements OnInit, OnDestroy {
  public loadingContent = true;
  public errors: any[] = [];

  commandId: number;
  idDeviceType: number;
  parameterId: number;
  permission = 'CFG_DEVICE_EDIT_COMMANDS';

  @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;
  @ViewChild('cellNameParam', { static: false })
  public cellNameParam: TemplateRef<any>;
  @ViewChild('cellValueParam', { static: false })
  public cellValueParam: TemplateRef<any>;
  sub$: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private deviceTypeComParamOptionService: DeviceTypeCommandParameterOptionService,
    private permissionCheckUtils: PermissionCheckUtils
  ) {
    this.commandId = this.activatedRoute.parent.snapshot.params.idDeviceTypeCommand;
    this.idDeviceType = this.activatedRoute.parent.snapshot.params.idDeviceType;
    this.parameterId = this.activatedRoute.parent.snapshot.params.id;
    deviceTypeComParamOptionService.idDeviceType = this.idDeviceType;
    deviceTypeComParamOptionService.idDeviceTypeCommand = this.commandId;
    deviceTypeComParamOptionService.idParameter = this.parameterId;
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
    this.router.navigate([
      `commands-module/o/types-devices/${this.idDeviceType}/command/${this.commandId}/parameters/${this.parameterId}/options/new`
    ]);
  }

  private loadData() {
    this.sub$ = this.deviceTypeComParamOptionService
      .getDeviceTypeCommandParameterOptions()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (parameters: IDeviceTypeCommandParameterOption[]) => {
          this.initDG(parameters);
        },
        error => {
          this.errors = [error];
        }
      );
  }

  private initDG(parameters: IDeviceTypeCommandParameterOption[]) {
    this.dataGrid.initDataGrid();

    this.dataGrid.KeyField = 'Id';
    this.dataGrid.Columns = [
      {
        Name: 'Text',
        Caption: AppLocalization.Name,
        CellTemplate: this.cellNameParam
      },
      {
        Name: 'Value',
        Caption: AppLocalization.Value
      }
    ];
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

  public onDGRowActionBtnClick(button: any) {
    if (button.action === 'Delete') {
      const itemId = button.item.Id;
      this.loadingContent = true;
      this.deviceTypeComParamOptionService
        .deleteDeviceTypeCommandParameterOption(itemId)
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
