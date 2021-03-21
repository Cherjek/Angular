import { AppLocalization } from 'src/app/common/LocaleRes';
import { OesService } from 'src/app/services/tariff-calculator/oes.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigateItem } from '../../../../../../common/models/Navigate/NavigateItem';

import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { IOES } from 'src/app/services/tariff-calculator/models/oes';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-oes-card',
  templateUrl: './oes-card.component.html',
  styleUrls: ['./oes-card.component.less'],
})
export class OesCardComponent implements OnInit, OnDestroy {
  public oesName: string;
  public oes: IOES;
  private oesId: string | number;
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
      code: 'day-zones',
      url: 'day-zones',
      name: AppLocalization.ZonesOfTheDay,
      access: 'TC_DAY_ZONE_VIEW'
    },
  ];
  subParam$: Subscription;

  public get isNew() {
    return this.oesId === 'new';
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private oesService: OesService,
    private permissionCheckUtils: PermissionCheckUtils
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.oesId = param.id;
    });

    this.sub$ = this.oesService.get(this.oesId).subscribe((x: IOES) => {
      this.oes = x;
      this.oesName = `${this.oes.Name}, ${this.oes.Code}`;
    });
        
    this.permissionCheckUtils
      .getAccess([
        'TC_OES_DELETE'
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
      promise = this.oesService.delete(this.oesId as number);
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl('/tariff-calculator/oeses');
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
