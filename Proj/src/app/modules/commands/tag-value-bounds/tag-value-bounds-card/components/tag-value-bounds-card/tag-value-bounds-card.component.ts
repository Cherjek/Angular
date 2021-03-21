import { AppLocalization } from 'src/app/common/LocaleRes';
import { ITagValueBound } from './../../../../../../services/commands/Models/TagValueBounds';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigateItem } from '../../../../../../common/models/Navigate/NavigateItem';

import { Subscription, forkJoin, Observable } from 'rxjs';
import {
  ContextButtonItem,
  ContextButtonItemConfirm,
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { TagValueBoundsService } from 'src/app/services/commands/Configuration/tag-value-bounds.service';
import { PermissionCheck } from 'src/app/core';

@Component({
  selector: 'rom-tag-value-bounds-card',
  templateUrl: './tag-value-bounds-card.component.html',
  styleUrls: ['./tag-value-bounds-card.component.less'],
})
export class TagValueBoundsCardComponent implements OnInit, OnDestroy {
  public boundName: string;
  public bound: ITagValueBound;
  private boundId: string | number;
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
      code: 'logic-types',
      url: 'logic-types',
      name: AppLocalization.TagTypes,
      access: ['REF_VIEW_LOGIC_DEVICE_TAGS','CFG_TAG_BOUNDS_TAGS_VIEW']
    },
  ];
  subParam$: Subscription;

  public get isNew() {
    return this.boundId === 'new';
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private tagValueBoundsService: TagValueBoundsService,
    private permissionCheck: PermissionCheck
  ) {}

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.boundId = param.id;
    });

    this.sub$ = this.tagValueBoundsService
      .get(this.boundId)
      .subscribe((x: ITagValueBound) => {
        this.bound = x;
        this.boundName = `${this.bound.Name}`;
      });

    this.accessInit().subscribe(results => {
      if (results[0]) {
        this.contextButtonItems = [
          {
            code: 'delete',
            name: AppLocalization.Delete,
            confirm: new ContextButtonItemConfirm(
              AppLocalization.DeleteConfirm,
              AppLocalization.Delete
            ),
          },
        ];
      }
    });    
  }

  ngOnDestroy() {
    this.unsubscriber(this.sub$);
    this.unsubscriber(this.subParam$);
  }

  private accessInit(): Observable<boolean[]> {
    const checkAccess = [
      'CFG_TAG_BOUNDS_DELETE'
    ];

    const obsrvs: any[] = [];
    checkAccess.forEach((access: string | string[]) => {
      obsrvs.push(this.permissionCheck.checkAuthorization(access));
    });

    return forkJoin<boolean>(obsrvs);
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
      promise = this.tagValueBoundsService.delete(this.boundId as number);
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl('/commands-module/bounds');
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
