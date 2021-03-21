import { AppLocalization } from 'src/app/common/LocaleRes';
import { PeakHour } from './../../../../../services/tariff-calculator/models/peak-hour';
import { PeakHoursService } from 'src/app/services/tariff-calculator/peak-hours.service';
import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { Utils } from 'src/app/core';

@Component({
  selector: 'rom-price-zones-peak-card-property',
  templateUrl: './price-zones-peak-card-property.component.html',
  styleUrls: ['./price-zones-peak-card-property.component.less'],
})
export class PriceZonesPeakCardPropertyComponent implements OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private peakId: number | string;
  private subscription: Subscription;
  private sub$: Subscription;

  public get isNew() {
    return this.peakId === 'new';
  }
  public properties: IEntityViewProperty[];

  constructor(
    private peakHoursService: PeakHoursService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe((param) => {
      this.peakId = param.id;
      this.peakHoursService.idPriceZone = param.priceZoneId;
      this.peakHoursService.idPeakHour = param.id;

      this.loadPeaks();
    });
  }

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.sub$);
  }

  private loadPeaks() {
    this.loadingContent = true;
    this.sub$ = this.peakHoursService
      .getPeakHour()
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: PeakHour) => {
          if (this.isNew)
            [(data.Date = new Date(Date.now()).toLocaleDateString())];
          this.initProperties(data);
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(peakHour: PeakHour) {
    this.properties = [
      {
        Code: 'Date',
        Name: AppLocalization.DateAction,
        Type: 'Date',
        Value: this.formatDate(peakHour),
        IsRequired: true,
        IsMonthMode: true,
      },
      {
        Code: 'PeakHours',
        Name: AppLocalization.PlannedPeakHours,
        Type: 'TimeRange',
        Value: this.sortRange(peakHour.PeakHours),
        IsRequired: true,
      },
    ];
  }

  private formatDate(peakHour: PeakHour): any {
    const date: any = Utils.DateConvert.toDateTimeRequest(
      Utils.DateFormat.Instance.getDate(peakHour.Date)
    );
    return date.slice(0, 7);
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const peakHour = new PeakHour();
    if (!this.isNew) {
      peakHour.Id = this.peakId as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      peakHour[prop.Code] = prop.Value;
    });
    if (!peakHour.Date) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.DateAction}"`];
      return;
    } else if (!peakHour.PeakHours.length) {
      this.errors = [AppLocalization.ScheduledPeakHoursNeedToBeSet];
      return;
    }
    peakHour.Date = Utils.DateConvert.toDateTimeRequest(peakHour.Date);
    this.loadingContent = true;
    this.peakHoursService
      .postPeakHour(peakHour)
      .then((peakId) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + peakId], {
            relativeTo: this.activatedRoute,
          });
        } else {
          this.loadPeaks();
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
