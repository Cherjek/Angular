import { AppLocalization } from 'src/app/common/LocaleRes';
import { Region } from './../../../../../../services/tariff-calculator/models/region';
import { RegionService } from './../../../../../../services/tariff-calculator/region.service';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigateItem } from '../../../../../../common/models/Navigate/NavigateItem';

import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-regions-card',
  templateUrl: './regions-card.component.html',
  styleUrls: ['./regions-card.component.less'],
})
export class RegionsCardComponent implements OnInit, OnDestroy {
  public regionName: string;
  public region: Region;
  private regionId: string | number;
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
      code: 'transfers',
      url: 'transfers',
      name: AppLocalization.BoilerRates,
      access: 'TC_TRANSFER_TARIFF_VIEW'
    },
  ];
  subParam$: Subscription;

  public get isNew() {
    return this.regionId === 'new';
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private regionService: RegionService,
    private permissionCheckUtils: PermissionCheckUtils
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.regionId = param.id;
    });

    this.sub$ = this.regionService.get(this.regionId).subscribe((x: Region) => {
      this.region = x;
      this.regionName = `${this.region.Name}, ${this.region.Code}`;
    });
    
    this.permissionCheckUtils
      .getAccess([
        'TC_REGION_DELETE'
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
      promise = this.regionService.delete(this.regionId as number);
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl('/tariff-calculator/regions');
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
