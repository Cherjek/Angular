import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { ICustomer } from 'src/app/services/sub-personal-account/models/Customer';
import { PaSubscriberCardService } from 'src/app/services/sub-personal-account/pa-subscriber-card.service';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-pa-subscribers-card',
  templateUrl: './pa-subscribers-card.component.html',
  styleUrls: ['./pa-subscribers-card.component.less'],
})
export class PaSubscribersCardComponent implements OnInit, OnDestroy {
  public userName: string;
  public user: ICustomer;
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
      access: 'CPA_VIEW_CUSTOMER'
    },
    {
      code: 'hierarchy-nodes',
      url: 'hierarchy-nodes',
      name: AppLocalization.HierarchyNodes,
      access: 'CPA_VIEW_CUSTOMER_NODES'
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
    private paSubscriberCardService: PaSubscriberCardService
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.appId = param.id;
    });

    this.sub$ = this.paSubscriberCardService
      .get(this.appId)
      .subscribe((x: ICustomer) => {
        this.user = x;
        if (this.user) {
          this.userName = `${this.user.Surname}, ${this.user.FirstName}`;
        }
      });

    this.permissionCheckUtils
      .getAccess(
        ['CPA_DELETE_CUSTOMER'],
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
      promise = this.paSubscriberCardService.delete(this.appId as number);
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
