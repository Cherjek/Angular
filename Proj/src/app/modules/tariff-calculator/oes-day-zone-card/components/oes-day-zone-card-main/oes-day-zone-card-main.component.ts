import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { DayZonesService } from 'src/app/services/tariff-calculator/day-zone.service';
import { IDayZone } from 'src/app/services/tariff-calculator/models/day-zone';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-oes-day-zone-card-main',
  templateUrl: './oes-day-zone-card-main.component.html',
  styleUrls: ['./oes-day-zone-card-main.component.less'],
})
export class OesDayZoneCardMainComponent implements OnInit, OnDestroy {
  public dayZoneDate: string;
  public dayZone: IDayZone;
  private dayZoneId: string | number;
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
  oesId: number;

  public get isNew() {
    return this.dayZoneId === 'new';
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private dayZonesService: DayZonesService,    
    private permissionCheckUtils: PermissionCheckUtils
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.dayZoneId = param.id;
      this.oesId = param.oesId;
      this.dayZonesService.idOes = param.oesId;
      this.dayZonesService.idDayZone = param.id;
    });

    this.sub$ = this.dayZonesService.getDayZone().subscribe((x: IDayZone) => {
      this.dayZone = x;
      if (!this.isNew) {
        this.dayZoneDate = `${this.dayZone.Date}`;
      }
    });
   
    this.permissionCheckUtils
      .getAccess([
        'TC_DAY_ZONE_DELETE'
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
      promise = this.dayZonesService.deleteDayZone(this.dayZoneId as number);
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl(
            `tariff-calculator/oeses/${this.oesId}/day-zones`
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
}
