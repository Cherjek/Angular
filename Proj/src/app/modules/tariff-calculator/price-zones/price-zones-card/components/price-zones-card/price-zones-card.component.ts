import { AppLocalization } from 'src/app/common/LocaleRes';
import { PriceZoneService } from 'src/app/services/tariff-calculator/price-zone.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigateItem } from '../../../../../../common/models/Navigate/NavigateItem';

import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { IPriceZone } from 'src/app/services/tariff-calculator/models/price-zone';
import { PermissionCheckUtils } from 'src/app/core/authentication/permission-check';

@Component({
  selector: 'price-zones-card',
  templateUrl: './price-zones-card.component.html',
  styleUrls: ['./price-zones-card.component.less'],
})
export class PriceZonesCardComponent implements OnInit, OnDestroy {
  public zoneName: string;
  public zone: IPriceZone;
  private zoneId: string | number;
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
    {
      code: 'peak-hours',
      url: 'peak-hours',
      name: AppLocalization.PlannedPeakHours,
      access: 'TC_PLAN_PEAK_HOURS_VIEW'
    },
  ];
  subParam$: Subscription;

  public get isNew() {
    return this.zoneId === 'new';
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private priceZoneService: PriceZoneService,
    private permissionCheckUtils: PermissionCheckUtils
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.zoneId = param.id;
    });

    this.sub$ = this.priceZoneService
      .get(this.zoneId)
      .subscribe((x: IPriceZone) => {
        this.zone = x;
        this.zoneName = `${this.zone.Name}, ${this.zone.Code}`;
      });

    this.permissionCheckUtils
      .getAccess([
        'TC_PRICE_ZONE_DELETE'
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
      promise = this.priceZoneService.delete(this.zoneId as number);
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl('/tariff-calculator/price-zones');
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
}
