import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IEntityViewProperty } from '../../../../../../services/common/Interfaces/IEntityViewProperty';
import { DeviceType } from 'src/app/services/data-query';
import { ConfigCommandDeviceTypesService } from 'src/app/services/commands/Configuration/DeviceLogicTypesCommandService.service';

@Component({
  selector: 'rom-commands-tldc-properties',
  templateUrl: './card-properties.component.html',
  styleUrls: ['./card-properties.component.less']
})
export class CommandsTypeLogicDevicesCardPropertiesComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private deviceId: number | string;
  private subscription: Subscription;
  sub$: Subscription;

  public get isNew() {
    return this.deviceId === 'new';
  }
  public properties: IEntityViewProperty[];
  constructor(
    private configCommandDevTypesService: ConfigCommandDeviceTypesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(params => {
      this.deviceId = params.id;

      this.loadDevices();
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.sub$);
  }

  private loadDevices() {
    this.loadingContent = true;
    this.sub$ = this.configCommandDevTypesService
      .get(this.deviceId)
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: DeviceType) => {
          this.initProperties(data);
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(device: DeviceType) {
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
      }
    ];
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const device = new DeviceType();
    if (!this.isNew) {
      device.Id = this.deviceId as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      device[prop.Code] = prop.Value;
    });
    if (!device.Name) {
      this.errors = [AppLocalization.YouNeedToSetAName];
      return;
    } else if (!device.Code) {
      this.errors = [AppLocalization.YouNeedToSetTheCode];
      return;
    }
    this.loadingContent = true;
    this.configCommandDevTypesService
      .post(device)
      .then((idDevice: number) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + idDevice], {
            relativeTo: this.activatedRoute
          });
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

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }
}
