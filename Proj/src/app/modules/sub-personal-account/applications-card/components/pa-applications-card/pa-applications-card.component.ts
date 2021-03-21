import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';
import { ISubPersonalAccount } from 'src/app/services/sub-personal-account/models/SubPersonalAccount';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-pa-applications-card',
  templateUrl: './pa-applications-card.component.html',
  styleUrls: ['./pa-applications-card.component.less'],
})
export class PaApplicationsCardComponent implements OnInit, OnDestroy {
  public appName: string;
  public appType: ISubPersonalAccount;
  private appId: string | number;
  private sub$: Subscription;
  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  public contextButtonItems: ContextButtonItem[];
  public menuItems: NavigateItem[] = [
    {
      code: 'property',
      url: 'property',
      name: AppLocalization.Properties,
      access: 'CPA_VIEW_APP'
    },
    {
      code: 'types-tags',
      url: 'types-tags',
      name: AppLocalization.LogicDeviceTypesTags,
      access: 'CPA_VIEW_APP_TAG_TYPES'
    },
    {
      code: 'doc-types',
      url: 'doc-types',
      name: AppLocalization.DocumentTypes,
      access: 'CPA_VIEW_APP_DOCUMENT_TYPES'
    },
  ];
  subParam$: Subscription;

  public get isNew() {
    return this.appId === 'new';
  }

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private subPersonalAccountService: SubPersonalAccountService
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.appId = param.id;
    });

    this.sub$ = this.subPersonalAccountService
      .get(this.appId)
      .subscribe((x: ISubPersonalAccount) => {
        this.appType = x;
        if (this.appType) {
          this.appName = `${this.appType.Name}, ${this.appType.Code}`;
        }
      });

    this.permissionCheckUtils
      .getAccess(
        ['CPA_DELETE_APP'],
        [
          {
            code: 'delete',
            name: AppLocalization.Delete,
            confirm: new ContextButtonItemConfirm(
              AppLocalization.DeleteConfirm,
              AppLocalization.Delete
            ),
          },
        ]
      )
      .subscribe((result) => (this.contextButtonItems = result));
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
      promise = this.subPersonalAccountService.delete(this.appId as number);
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl('/sub-personal-account/apps');
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
