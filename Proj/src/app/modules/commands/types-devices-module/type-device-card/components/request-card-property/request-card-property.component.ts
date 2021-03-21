import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IEntityViewProperty } from '../../../../../../services/common/Interfaces/IEntityViewProperty';
import { DeviceType } from 'src/app/services/data-query';
import { DeviceTypesService } from 'src/app/services/commands/Configuration/device-types.service';

@Component({
  selector: 'rom-request-card-property',
  templateUrl: './request-card-property.component.html',
  styleUrls: ['./request-card-property.component.less']
})
export class RequestCardPropertyComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private idDeviceType: number | string;
  private subscription: Subscription;
  sub$: Subscription;

  public get isNew() {
    return this.idDeviceType === 'new';
  }
  public properties: IEntityViewProperty[];

  constructor(
    private deviceTypesService: DeviceTypesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(params => {
      this.idDeviceType = params.id;

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
    this.sub$ = this.deviceTypesService
      .get(this.idDeviceType)
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

  private initProperties(deviceType: DeviceType) {
    this.properties = [
      {
        Code: 'Name',
        Name: AppLocalization.TheNameOfTheDevice,
        Type: 'String',
        Value: deviceType.Name,
        IsRequired: true
      },
      {
        Code: 'Code',
        Name: AppLocalization.Code,
        Type: 'String',
        Value: deviceType.Code,
        IsRequired: true
      }
    ];
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const device = new DeviceType();
    if (!this.isNew) {
      device.Id = this.idDeviceType as number;
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
    this.deviceTypesService
      .post(device)
      .then((idDevice: number) => {
        this.loadingContent = false;
        if (this.isNew) {
          this.idDeviceType = idDevice;
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
