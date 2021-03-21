import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DeviceType } from 'src/app/services/data-query';
import { LogicDeviceTypesService } from 'src/app/services/configuration/logic-device-types.service';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { LogicDeviceKindsService } from 'src/app/services/references/logic-device-kinds.service';
import { LogicDeviceKind } from 'src/app/services/references/models/LogicDeviceKinds';

@Component({
  selector: 'rom-logic-device-kinds-card-property',
  templateUrl: './logic-device-kinds-card-property.component.html',
  styleUrls: ['./logic-device-kinds-card-property.component.less']
})
export class LogicDeviceKindsCardPropertyComponent
  implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private idDevice: number | string;
  private subscription: Subscription;
  sub$: Subscription;

  public get isNew() {
    return this.idDevice === 'new';
  }
  public properties: IEntityViewProperty[];

  constructor(
    private logicDeviceKindsService: LogicDeviceKindsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(param => {
      this.idDevice = param.id;
      this.logicDeviceKindsService.idLogicDevice = param.logicDeviceId;
      this.logicDeviceKindsService.idDeviceKind = param.id;

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
    this.sub$ = this.logicDeviceKindsService
      .getDeviceKind()
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: LogicDeviceKind) => {
          this.initProperties(data);
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(hierarchy: LogicDeviceKind) {
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
    const device = new LogicDeviceKind();
    if (!this.isNew) {
      device.Id = this.idDevice as number;
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
    this.logicDeviceKindsService
      .postDeviceKind(device)
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
