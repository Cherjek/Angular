import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { IAppDocumentType } from 'src/app/services/sub-personal-account/models/app-document-type';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-app-doc-type-card',
  templateUrl: './app-doc-type-card.component.html',
  styleUrls: ['./app-doc-type-card.component.less'],
})
export class AppDocTypeCardComponent implements OnInit, OnDestroy {
  public docName: string;
  public docType: IAppDocumentType;
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
    },
    {
      code: 'statuses',
      url: 'statuses',
      name: AppLocalization.Statuses,
      access: 'CPA_VIEW_APP_DOCUMENT_STATUS_TYPES'
    },
  ];
  subParam$: Subscription;
  docId: any;

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
      this.appId = param.appId;
      this.docId = param.id;
    });

    this.sub$ = this.subPersonalAccountService
      .getDocumentType(this.appId, this.docId)
      .subscribe((x: IAppDocumentType) => {
        this.docType = x;
        if (this.docType) {
          this.docName = `${this.docType.Name}`;
        }
      });

    this.permissionCheckUtils
      .getAccess(
        ['CPA_EDIT_APP_DOCUMENT_TYPES'],
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
      .subscribe((result) => this.contextButtonItems = result);
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
      promise = this.subPersonalAccountService.deleteDocumentType(
        this.appId,
        this.docId
      );
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl(
            `/sub-personal-account/apps/${this.appId}/doc-types`
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
