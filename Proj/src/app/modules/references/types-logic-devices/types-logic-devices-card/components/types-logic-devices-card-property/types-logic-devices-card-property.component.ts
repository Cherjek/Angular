import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IEntityViewProperty } from '../../../../../../services/common/Interfaces/IEntityViewProperty';
import { DeviceType } from 'src/app/services/data-query';
import { LogicDeviceTypesService } from 'src/app/services/configuration/logic-device-types.service';

@Component({
  selector: 'rom-types-logic-devices-card-property',
  templateUrl: './types-logic-devices-card-property.component.html',
  styleUrls: ['./types-logic-devices-card-property.component.less']
})
export class TypesLogicDevicesCardPropertyComponent
  implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private idHierarchy: number | string;
  private subscription: Subscription;
  sub$: Subscription;

  public get isNew() {
    return this.idHierarchy === 'new';
  }
  public properties: IEntityViewProperty[];

  constructor(
    private logicDeviceService: LogicDeviceTypesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(params => {
      this.idHierarchy = params.id;

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
    this.sub$ = this.logicDeviceService
      .get(this.idHierarchy)
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

  private initProperties(hierarchy: DeviceType) {
    this.properties = [
      {
        Code: 'Name',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: hierarchy.Name,
        IsRequired: true
      },
      {
        Code: 'Code',
        Name: AppLocalization.Code,
        Type: 'String',
        Value: hierarchy.Code,
        IsRequired: true
      }
    ];
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const device = new DeviceType();
    if (!this.isNew) {
      device.Id = this.idHierarchy as number;
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
    this.logicDeviceService
      .post(device)
      .then(idDevice => {
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
