import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { PeakHoursService } from 'src/app/services/tariff-calculator/peak-hours.service';
import { IPeakHour, PeakHour } from 'src/app/services/tariff-calculator/models/peak-hour';
import { PermissionCheckUtils, Utils } from 'src/app/core';

@Component({
  selector: 'rom-price-zones-peak-card-main',
  templateUrl: './price-zones-peak-card-main.component.html',
  styleUrls: ['./price-zones-peak-card-main.component.less'],
})
export class PriceZonesPeakCardMainComponent implements OnInit, OnDestroy {
  public peakHourDate: string;
  public peakHour: IPeakHour;
  private peakId: string | number;
  private sub$: Subscription;
  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  public contextButtonItems: ContextButtonItem[];
  public menuItems: NavigateItem[] = [
    {
      code: 'property',
      url: 'property',
      name: AppLocalization.Properties,
    },
  ];
  subParam$: Subscription;
  priceZoneId: number;

  public get isNew() {
    return this.peakId === 'new';
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private peakHoursService: PeakHoursService,
    private permissionCheckUtils: PermissionCheckUtils
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.peakId = param.id;
      this.priceZoneId = param.priceZoneId;
      this.peakHoursService.idPriceZone = param.priceZoneId;
      this.peakHoursService.idPeakHour = param.id;
    });

    this.sub$ = this.peakHoursService
      .getPeakHour()
      .subscribe((x: IPeakHour) => {
        this.peakHour = x;
        if (!this.isNew) {
          this.peakHourDate = `${this.formatDate(this.peakHour)}`;
        }
      });

    this.permissionCheckUtils
      .getAccess([
        'TC_PLAN_PEAK_HOURS_DELETE'
      ], [
        {
          code: 'delete',
          name: AppLocalization.Delete,
          confirm: new ContextButtonItemConfirm(
            AppLocalization.DeleteConfirm,
            AppLocalization.Delete
          ),
        },
      ])
      .subscribe(result => this.contextButtonItems = result);
  }

  ngOnDestroy() {
    this.unsubscriber(this.sub$);
    this.unsubscriber(this.subParam$);
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }

  contextButtonHeaderClick(code: string) {
    this.loadingPanel = true;
    let promise: Promise<any> = null;
    let callback: any;
    if (code === 'delete') {
      promise = this.peakHoursService.deletePeakHour(this.peakId as number);
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl(
            `tariff-calculator/price-zones/${this.priceZoneId}/peak-hours`
          );
        }
      };
    }
    promise
      .then((result: any) => {
        this.loadingPanel = false;
        callback(result);
      })
      .catch((error: any) => {
        this.loadingPanel = false;
        this.headerErrors = [error];
      });
  }
  
  private formatDate(peakHour: PeakHour): any {
    const date = Utils.DateFormat.Instance.getDate(peakHour.Date);
    return date.slice(0, 7);
  }
}
