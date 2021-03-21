import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { DayZonesService } from 'src/app/services/tariff-calculator/day-zone.service';
import { DayZone } from 'src/app/services/tariff-calculator/models/day-zone';
import { Utils } from 'src/app/core';

@Component({
  selector: 'rom-oes-day-zone-card-property',
  templateUrl: './oes-day-zone-card-property.component.html',
  styleUrls: ['./oes-day-zone-card-property.component.less'],
})
export class OesDayZoneCardPropertyComponent implements OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private dayZoneId: number | string;
  private subscription: Subscription;
  private sub$: Subscription;

  public get isNew() {
    return this.dayZoneId === 'new';
  }
  public properties: IEntityViewProperty[];

  constructor(
    private dayZonesService: DayZonesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe((param) => {
      this.dayZoneId = param.id;
      this.dayZonesService.idOes = param.oesId;
      this.dayZonesService.idDayZone = param.id;

      this.loadData();
    });
  }

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.sub$);
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = this.dayZonesService
      .getDayZone()
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: DayZone) => {
          if (this.isNew) {
            data.Date = new Date(Date.now()).toLocaleDateString();
            data.OrderDate = new Date(Date.now()).toLocaleDateString();
          }
          this.initProperties(data);
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(dayZone: DayZone) {
    this.properties = [
      {
        Code: 'Date',
        Name: AppLocalization.TheStartDateOfTheZones,
        Type: 'Date',
        Value: Utils.DateFormat.Instance.getDate(dayZone.Date),
        IsRequired: true
      },
      {
        Code: 'OrderDate',
        Name: AppLocalization.TheDateOfTheOrder,
        Type: 'Date',
        Value: Utils.DateFormat.Instance.getDate(dayZone.OrderDate),
        IsRequired: true
      },
      {
        Code: 'OrderNumber',
        Name: AppLocalization.OrderNumb,
        Type: 'String',
        Value: dayZone.OrderNumber,
        IsRequired: true,
      },
      {
        Code: 'NightHours',
        Name: AppLocalization.NightZone,
        Type: 'TimeRange',
        Value: this.sortRange(dayZone.NightHours),
        IsRequired: true,
      },
      {
        Code: 'DayHours',
        Name: AppLocalization.PeakZone,
        Type: 'TimeRange',
        Value: this.sortRange(dayZone.DayHours),
        IsRequired: true,
      },
    ];
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const dayZone = new DayZone();
    if (!this.isNew) {
      dayZone.Id = this.dayZoneId as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      dayZone[prop.Code] = prop.Value;
    });
    if (!dayZone.Date) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.TheStartDateOfTheZones}"`];
      return;
    }
    if (!dayZone.OrderDate) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.TheDateOfTheOrder}"`];
      return;
    }
    if (!dayZone.OrderNumber) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.OrderNumb}"`];
      return;
    } else if (!dayZone.DayHours.length) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.PeakZone}"`];
      return;
    } else if (!dayZone.NightHours.length) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.NightZone}"`];
      return;
    }
    dayZone.Date = Utils.DateConvert.toDateTimeRequest(dayZone.Date);
    dayZone.OrderDate = Utils.DateConvert.toDateTimeRequest(dayZone.OrderDate);
    this.loadingContent = true;
    this.dayZonesService
      .postDayZone(dayZone)
      .then((dayZoneId) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + dayZoneId], {
            relativeTo: this.activatedRoute,
          });
        } else {
          this.loadData();
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

  private sortRange(ranges: number[]) {
    if (ranges && ranges.length) {
      return ranges.sort((x, y) => x - y);
    }
    return [];
  }
}
