import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { ContextButtonItem } from 'src/app/controls/ContextButton/ContextButtonItem';
import { GlobalValues } from 'src/app/core';
import { LogicDeviceEditorTagsService } from 'src/app/services/objecteditors.module/logicDevice.editor/lde.tags/LogicDeviceEditorTags';

@Component({
  selector: 'app-tags-card',
  templateUrl: './tags-card.component.html',
  styleUrls: ['./tags-card.component.less'],
})
export class TagsCardComponent implements OnInit {
  public header: any;

  public menuItems: NavigateItem[];

  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  public contextButtonItems: ContextButtonItem[];

  public ldId: any;
  public ids: any;
  public noLDError = false;
  ldeTags$: Subscription;
  page = GlobalValues.Instance.Page;
  
  tag: any;
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private ldeTagsService: LogicDeviceEditorTagsService) {
      this.ldId = activateRoute.snapshot.params.id;
      this.ids = activateRoute.snapshot.queryParams.ids;
  }

  ngOnInit() {
    if (this.ids != null) {
      this.ldeTags$ = this.ldeTagsService
          .getTagsWithFilter(this.ldId, this.ids)
          .subscribe(
              (tags: any) => {                
                  if (tags && tags.length) {
                    this.tag = tags[0];
                    this.accessTabMenu();
                  }
              },
              (error: any) => {
                  
              }
          );
    }
    
  }

  ngOnDestroy() {
    this.unsubscriber([
      this.ldeTags$,
    ]);
  }

  unsubscriber(subs: Subscription[]) {
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  private accessTabMenu() {
    this.menuItems = [
      {
        code: 'properties',
        url: 'properties',
        name: AppLocalization.Properties,
        // access: Object.assign(new AccessDirectiveConfig(),
        //   { keySource: this.ldId, source: 'LogicDevices', value: 'OC_VIEW_EQUIPMENT_PROPERTIES' })
      }/*, {
        code: 'params',
        url: 'params',
        name: AppLocalization.Options,
        // access: Object.assign(new AccessDirectiveConfig(),
        //   { keySource: this.ldId, source: 'LogicDevices', value: 'OC_VIEW_EQUIPMENT_TAGS' })
      } */    
    ];
    GlobalValues.Instance.Page = {
      TagType: this.tag.TagType.Id
    };
  }
}
