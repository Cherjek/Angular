import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { ContextButtonItem, ContextButtonItemConfirm } from 'src/app/controls/ContextButton/ContextButtonItem';
import { GlobalValues, PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'app-pa-request-card',
  templateUrl: './pa-request-card.component.html',
  styleUrls: ['./pa-request-card.component.scss']
})
export class PaRequestCardComponent implements OnInit {

  private sub$: Subscription;
  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  public contextButtonItems: ContextButtonItem[];
  public menuItems: NavigateItem[] = [
    {
      code: 'main',
      url: 'main',
      name: AppLocalization.KeyOptions
    },
    {
      code: 'hierarchy-nodes',
      url: 'hierarchy-nodes',
      name: AppLocalization.HierarchyNodes
    },
    {
      code: 'files',
      url: 'files',
      name: AppLocalization.Files
    },
    {
      code: 'reject',
      url: 'reject',
      name: AppLocalization.RejectForm
    },
  ];
  subParam$: Subscription;
  page = GlobalValues.Instance.Page;
  
  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private activateRoute: ActivatedRoute,
    private router: Router,) { 

    }

  ngOnInit() {
    this.contextButtonItems = [
      {
        code: 'deny',
        name: AppLocalization.Deny,
        confirm: new ContextButtonItemConfirm(
          AppLocalization.DeleteConfirm,
          AppLocalization.Delete
        )
      }, {
        code: 'confirm',
        name: AppLocalization.Confirm,
        confirm: new ContextButtonItemConfirm(
          AppLocalization.DeleteConfirm,
          AppLocalization.Delete
        )
      }
    ]
  }

}
