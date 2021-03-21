import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { Region } from 'src/app/services/tariff-calculator/models/region';
import { RegionService } from 'src/app/services/tariff-calculator/region.service';
import { OES } from 'src/app/services/tariff-calculator/models/oes';
import { PriceZone } from 'src/app/services/tariff-calculator/models/price-zone';
import { OesService } from 'src/app/services/tariff-calculator/oes.service';
import { PriceZoneService } from 'src/app/services/tariff-calculator/price-zone.service';
import { TimeZoneService } from 'src/app/services/tariff-calculator/time-zone.service';
import { TimeZone } from 'src/app/services/tariff-calculator/models/time-zone';

@Component({
  selector: 'rom-regions-card-property',
  templateUrl: './regions-card-property.component.html',
  styleUrls: ['./regions-card-property.component.less'],
})
export class RegionsCardPropertyComponent implements OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private idRegion: number | string;
  private subscription: Subscription;
  sub$: Subscription;
  priceZones: PriceZone[];
  oeses: OES[];
  timezones: TimeZone[];

  public get isNew() {
    return this.idRegion === 'new';
  }
  public properties: IEntityViewProperty[];

  constructor(
    private regionService: RegionService,
    private priceZoneService: PriceZoneService,
    private oesService: OesService,
    private timeZoneService: TimeZoneService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(
      (params) => {
        this.idRegion = params.id;

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
    this.sub$ = forkJoin([
      this.regionService.get(this.idRegion),
      this.priceZoneService.get(),
      this.oesService.get(),
      this.timeZoneService.get(),
    ])
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data) => {
          this.initProperties(data[0] as Region);
          this.priceZones = data[1] as PriceZone[];
          this.oeses = data[2] as OES[];
          this.timezones = data[3] as TimeZone[];
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(region: Region) {
    this.properties = [
      {
        Code: 'Name',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: region.Name,
        IsRequired: true,
      },
      {
        Code: 'Code',
        Name: AppLocalization.Code,
        Type: 'String',
        Value: region.Code,
        IsRequired: true,
      },
      {
        Code: 'TimeZone',
        Name: AppLocalization.TimeZone,
        Type: 'Option',
        Value: region.TimeZone,
        IsRequired: true,
      },
      {
        Code: 'AtsTimeZone',
        Name: AppLocalization.Label118,
        Type: 'Option',
        Value: region.AtsTimeZone,
        IsRequired: true,
      },
      {
        Code: 'PriceZone',
        Name: AppLocalization.Label114,
        Type: 'Option',
        Value: region.PriceZone,
      },
      {
        Code: 'Oes',
        Name: AppLocalization.Eco,
        Type: 'Option',
        Value: region.Oes,
      },
    ];
  }

  optionControlDropDown(event: any) {
    const property = event.property;
    if (property.Code === 'PriceZone') {
      property.arrayValues = this.priceZones;
    } else if (property.Code === 'Oes') {
      property.arrayValues = this.oeses;
    } else if (
      property.Code === 'TimeZone' ||
      property.Code === 'AtsTimeZone'
    ) {
      property.arrayValues = this.timezones;
    }
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const region = new Region();
    if (!this.isNew) {
      region.Id = this.idRegion as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      region[prop.Code] = prop.Value;
    });
    if (!region.Name) {
      this.errors = [AppLocalization.YouNeedToSetAName];
      return;
    } else if (!region.Code) {
      this.errors = [AppLocalization.YouNeedToSetTheCode];
      return;
    } else if (!region.TimeZone) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.TimeZone}"`];
      return;
    } else if (!region.AtsTimeZone) {
      this.errors = [AppLocalization.Label13];
      return;
    }
    this.loadingContent = true;
    this.regionService
      .post(region)
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
