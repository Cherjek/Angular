import { AppLocalization } from 'src/app/common/LocaleRes';
import { PriceZoneService } from 'src/app/services/tariff-calculator/price-zone.service';
import { PriceZone } from './../../../../../../services/tariff-calculator/models/price-zone';
import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IEntityViewProperty } from '../../../../../../services/common/Interfaces/IEntityViewProperty';

@Component({
  selector: 'app-price-zones-card-property',
  templateUrl: './price-zones-card-property.component.html',
  styleUrls: ['./price-zones-card-property.component.less'],
})
export class PriceZonesCardPropertyComponent implements OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private idZone: number | string;
  private subscription: Subscription;
  sub$: Subscription;

  public get isNew() {
    return this.idZone === 'new';
  }
  public properties: IEntityViewProperty[];

  constructor(
    private priceZoneService: PriceZoneService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(
      (params) => {
        this.idZone = params.id;

        this.loadItems();
      }
    );
  }

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.sub$);
  }

  private loadItems() {
    this.loadingContent = true;
    this.sub$ = this.priceZoneService
      .get(this.idZone)
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: PriceZone) => {
          this.initProperties(data);
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(hierarchy: PriceZone) {
    this.properties = [
      {
        Code: 'Name',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: hierarchy.Name,
        IsRequired: true,
      },
      {
        Code: 'Code',
        Name: AppLocalization.Code,
        Type: 'String',
        Value: hierarchy.Code,
        IsRequired: true,
      },
    ];
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const device = new PriceZone();
    if (!this.isNew) {
      device.Id = this.idZone as number;
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
    this.priceZoneService
      .post(device)
      .then((id) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + id], {
            relativeTo: this.activatedRoute,
          });
        } else {
          this.loadItems();
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
