import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IEntityViewProperty } from '../../../../../../services/common/Interfaces/IEntityViewProperty';
import { DataQueryType } from 'src/app/services/data-query';
import { DeviceTypeCommandParameterOptionService } from 'src/app/services/configuration/device-type-command-parameter-option.service';
import {
  IDeviceTypeCommandParameterOption,
  DeviceTypeCommandParameterOption
} from 'src/app/services/configuration/Models/DeviceTypeCommandParameterOption';

@Component({
  selector: 'rom-options-property-card',
  templateUrl: './options-property-card.component.html',
  styleUrls: ['./options-property-card.component.less']
})
export class OptionsPropertyCardComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private optionId: number | string;
  sub$: Subscription;
  commandId: any;
  idDeviceType: any;
  parameterId: number;
  queryValues: DataQueryType[];

  public get isNew() {
    return this.optionId === 'new';
  }
  public properties: IEntityViewProperty[];
  constructor(
    private deviceTypeCommParamOptionService: DeviceTypeCommandParameterOptionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.commandId = this.activatedRoute.parent.snapshot.params.idDeviceTypeCommand;
    this.optionId = this.activatedRoute.parent.snapshot.params.id;
    this.idDeviceType = this.activatedRoute.parent.snapshot.params.idDeviceType;
    this.parameterId = this.activatedRoute.parent.snapshot.params.idDeviceTypeCommandParameter;
    deviceTypeCommParamOptionService.idParameter = this.parameterId;
    deviceTypeCommParamOptionService.idDeviceType = this.idDeviceType;
    deviceTypeCommParamOptionService.idDeviceTypeCommand = this.commandId;
    deviceTypeCommParamOptionService.idOption = this.optionId as number;
    this.loadDevices();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscriber(this.sub$);
  }

  private loadDevices() {
    this.loadingContent = true;
    this.sub$ = this.deviceTypeCommParamOptionService
      .getDeviceTypeCommandParameterOption()
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: IDeviceTypeCommandParameterOption) => {
          this.initProperties(data);
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(device: IDeviceTypeCommandParameterOption) {
    this.properties = [
      {
        Code: 'Text',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: device.Text,
        IsRequired: true
      },
      {
        Code: 'Value',
        Name: AppLocalization.Value,
        Type: 'String',
        Value: device.Value,
        IsRequired: true
      }
    ];
  }

  optionControlDropDown(event: any) {
    const property = event.property;
    property.arrayValues = this.queryValues;
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const device = new DeviceTypeCommandParameterOption();
    if (!this.isNew) {
      device.Id = this.optionId as number;
    }
    device.IdDeviceTypeCommandParameter = this.parameterId;
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      device[prop.Code] = prop.Value;
    });
    if (!this.noErrors(device)) {
      return;
    }
    this.loadingContent = true;
    this.deviceTypeCommParamOptionService
      .postDeviceTypeCommandParameterOption(device)
      .then((optionId) => {
        this.loadingContent = false;

        if (this.isNew) {
          // TODO: Uncommento when Backendo Correcto
          // this.router.navigate(['../../' + optionId], {
          //   relativeTo: this.activatedRoute
          // });

          // Deleto when Backendo correcto
          this.router.navigateByUrl(
            `commands-module/o/types-devices/${this.idDeviceType}/command/${this.commandId}/parameters/${this.parameterId}/options/${optionId}/property`
          );
        } else {
          this.loadDevices();
        }

        propControl.cancelChangeProperty();
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  private noErrors(device: IDeviceTypeCommandParameterOption): boolean {
    if (!device.Text) {
      this.errors = [AppLocalization.YouNeedToSetAName];
      return false;
    } else if (!device.Value) {
      this.errors = [AppLocalization.YouNeedToSetTheValue];
      return false;
    }
    return true;
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }
}
