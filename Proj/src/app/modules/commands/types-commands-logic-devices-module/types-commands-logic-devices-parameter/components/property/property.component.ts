import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription, forkJoin } from 'rxjs';
import { IEntityViewProperty } from '../../../../../../services/common/Interfaces/IEntityViewProperty';
import { DataQueryType } from 'src/app/services/data-query';
import { DataQueryMainService } from 'src/app/services/data-query/data-query-main.service';
import { LogicDeviceTypeCommandParameterService } from 'src/app/services/commands/Configuration/logic-device-type-command-parameter.service';
import {
  ILogicDeviceCommandTypeParameter,
  LogicDeviceCommandTypeParameter
} from 'src/app/services/commands/Models/LogicDeviceCommandTypeParameter';

@Component({
  selector: 'rom-ctld-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.less']
})
export class TypeLogicDevicesPropertyComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private deviceId: number | string;
  private expectedQuery = ['Float', 'Integer', 'Bool', 'String', 'Datetime'];
  sub$: Subscription;
  commandId: any;
  queryValues: DataQueryType[];

  public get isNew() {
    return this.deviceId === 'new';
  }
  public properties: IEntityViewProperty[];
  constructor(
    private deviceTypeCommandParameterService: LogicDeviceTypeCommandParameterService,
    private dataQueryMainService: DataQueryMainService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.commandId = this.activatedRoute.parent.snapshot.params.deviceId;
    this.deviceId = this.activatedRoute.parent.snapshot.params.id;
    deviceTypeCommandParameterService.idParameter = this.deviceId as number;
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
        (data: [ILogicDeviceCommandTypeParameter, DataQueryType[]]) => {
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

  private initProperties(device: ILogicDeviceCommandTypeParameter) {
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
        Code: 'ValueType',
        Name: AppLocalization.DataType,
        Type: 'Option',
        Value: device.ValueType,
        IsRequired: true
      }
    ];

    if (device.ValueType) {
      if (device.ValueType.Name === 'Integer'
      || device.ValueType.Name === 'Float') {
        const minMaxProperties = [
          {
            Code: 'MinimumValue',
            Name: AppLocalization.MinValue,
            Type: device.ValueType.Name,
            Value: device.MinimumValue,
            IsRequired: true
          },
          {
            Code: 'MaximumValue',
            Name: AppLocalization.MaxValue,
            Type: device.ValueType.Name,
            Value: device.MaximumValue,
            IsRequired: true
          }
        ];
        this.properties = [...this.properties, ...minMaxProperties];
      }
    }
  }

  optionControlDropDown(event: any) {
    if (event.control.event === 'LOAD_TRIGGER') {
      const property = event.property;
      property.arrayValues = this.queryValues;
    } else if (event.control.event === 'SELECT') {
      const device = {};
      event.properties.forEach((prop: IEntityViewProperty) => {
        if (prop.Code !== 'MinimumValue' && prop.Code !== 'MaximumValue') {
          device[prop.Code] = prop.Value;
        }
      });
      this.initProperties(device as ILogicDeviceCommandTypeParameter);
    }
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const device = new LogicDeviceCommandTypeParameter();
    if (!this.isNew) {
      device.Id = this.deviceId as number;
    }
    device.IdLogicDeviceCommandType = this.commandId;
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
      .then(paramId => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigateByUrl(
            `commands-module/p/types-commands-logic-devices/${this.commandId}/parameters/${paramId}/property`
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

  private noErrors(device: LogicDeviceCommandTypeParameter): boolean {
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
