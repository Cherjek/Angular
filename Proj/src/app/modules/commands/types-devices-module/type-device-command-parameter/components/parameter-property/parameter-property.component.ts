import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription, forkJoin } from 'rxjs';
import { IEntityViewProperty } from '../../../../../../services/common/Interfaces/IEntityViewProperty';
import { DataQueryType } from 'src/app/services/data-query';
import { DeviceTypeCommandParameterService } from 'src/app/services/configuration/device-type-command-parameter.service';
import {
  IDeviceTypeCommandParameter,
  DeviceTypeCommandParameter
} from 'src/app/services/configuration/Models/DeviceTypeCommandParameter';
import { DataQueryMainService } from 'src/app/services/data-query/data-query-main.service';

@Component({
  selector: 'rom-parameter-property',
  templateUrl: './parameter-property.component.html',
  styleUrls: ['./parameter-property.component.less']
})
export class ParameterPropertyComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private deviceId: number | string;
  private expectedQuery = ['Float', 'Integer', 'Bool', 'String', 'Datetime'];
  sub$: Subscription;
  commandId: any;
  idDeviceType: any;
  queryValues: DataQueryType[];

  public get isNew() {
    return this.deviceId === 'new';
  }
  public properties: IEntityViewProperty[];
  constructor(
    private deviceTypeCommandParameterService: DeviceTypeCommandParameterService,
    private dataQueryMainService: DataQueryMainService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.commandId = this.activatedRoute.parent.snapshot.params.idDeviceTypeCommand;
    this.deviceId = this.activatedRoute.parent.snapshot.params.id;
    this.idDeviceType = this.activatedRoute.parent.snapshot.params.idDeviceType;
    deviceTypeCommandParameterService.idParameter = this.deviceId as number;
    deviceTypeCommandParameterService.idDeviceType = this.idDeviceType;
    deviceTypeCommandParameterService.idDeviceTypeCommand = this.commandId;
    this.loadDevices();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscriber(this.sub$);
  }

  private loadDevices() {
    this.loadingContent = true;
    const observs = [
      this.deviceTypeCommandParameterService.getParameter(),
      this.dataQueryMainService.getValueTypes()
    ];
    this.sub$ = forkJoin(observs)
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: [IDeviceTypeCommandParameter, DataQueryType[]]) => {
          this.initProperties(data[0]);
          this.queryValues = data[1].filter(x =>
            this.expectedQuery.includes(x.Name)
          );
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(device: IDeviceTypeCommandParameter) {
    this.properties = [
      {
        Code: 'Name',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: device.Name,
        IsRequired: true
      },
      {
        Code: 'Code',
        Name: AppLocalization.Code,
        Type: 'String',
        Value: device.Code,
        IsRequired: true
      },
      {
        Code: 'DefaultValue',
        Name: AppLocalization.DefaultValue,
        Type: 'String',
        Value: device.DefaultValue
      },
      {
        Code: 'ValueType',
        Name: AppLocalization.DataType,
        Type: 'Option',
        Value: device.ValueType,
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
    const device = new DeviceTypeCommandParameter();
    if (!this.isNew) {
      device.Id = this.deviceId as number;
    }
    device.IdDeviceTypeCommand = this.commandId;
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
    this.deviceTypeCommandParameterService
      .postParameter(device)
      .then(idParam => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigateByUrl(
            `commands-module/p/types-devices/${this.idDeviceType}/command/${this.commandId}/parameters/${idParam}/property`
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

  private noErrors(device: DeviceTypeCommandParameter): boolean {
    if (!device.Name) {
      this.errors = [AppLocalization.YouNeedToSetAName];
      return false;
    } else if (!device.Code) {
      this.errors = [AppLocalization.YouNeedToSetTheCode];
      return false;
    } else if (!device.ValueType) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.DataType}"`];
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
