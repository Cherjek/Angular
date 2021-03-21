import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/index';
import { ListView } from 'src/app/controls/ListView/ListView';
import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';

@Component({
  selector: 'rom-pa-applications-card-type-tags',
  templateUrl: './pa-applications-card-type-tags.component.html',
  styleUrls: ['./pa-applications-card-type-tags.component.less'],
})
export class PaApplicationsCardTypeTagsComponent implements OnInit, OnDestroy {
  public errors: any[] = [];
  public typesLoading: boolean;

  private urlParamsSubscription: Subscription;
  private appId: string | number;

  public typesPipeTrigger: Date;
  public tagsPipeTrigger: Date;

  public typeTags: any[];
  public isTypesListChange: boolean;

  public editMode: boolean = false;

  @ViewChild('ldTypesLV', { static: true }) public ldTypesLV: ListView;
  @ViewChild('ldTypeTagsLV', { static: true }) public ldTypeTagsLV: ListView;

  constructor(
    private activatedRoute: ActivatedRoute,
    private subPersonalAccountService: SubPersonalAccountService,
    private router: Router
  ) {
    this.urlParamsSubscription = this.activatedRoute.parent.params.subscribe(
      (params: any) => {
        this.appId = params['id'];
      },
      (error: any) => {
        this.errors = [error];
      }
    );
  }

  ngOnInit() {
    this.initTypeTags();
  }

  ngOnDestroy() {
    this.urlParamsSubscription.unsubscribe();
  }

  private initTypeTags() {
    this.typesLoading = true;
    this.subPersonalAccountService.getLogicDeviceTypes(this.appId).subscribe(
      (typetags: any[]) => {
        this.typeTags = typetags;

        this.typesLoading = false;
      },
      (error: any) => {
        this.errors = [error];
        this.typesLoading = false;
      }
    );
  }

  private resizeLVS(offset: number) {
    this.ldTypesLV.OffsetBottom = offset;
    this.ldTypeTagsLV.OffsetBottom = offset;
    setTimeout(() => {
      this.ldTypesLV.resizeVirtualScroll();
      this.ldTypeTagsLV.resizeVirtualScroll();
    }, 300);
  }

  public changeListTypeTags() {
    this.editMode = true;
    this.resizeLVS(50);
  }

  public saveTypeTagsChanges() {
    this.typesLoading = true;

    this.resizeLVS(0);

    this.subPersonalAccountService
      .putLogicDeviceTypes(this.typeTags, this.appId)
      .then((response: any) => {
        this.isTypesListChange = this.editMode = false;
        this.typesLoading = false;
      })
      .catch((error: any) => {
        this.errors = [error];
        this.typesLoading = false;
      });
  }

  public cancelTypeTagsChanges() {
    this.ldTypeTagsLV.DataSource.filter((LI) => LI.IsCheck).forEach((LI) => {
      LI.IsCheck = false;
    }); // на случай когда чекнули несколько строк и нажали "Отменить внесенные изменения(Отмена)"

    if (this.isTypesListChange) {
      //если были изменения, получаем список предыдущий
      this.initTypeTags();
    }

    this.resizeLVS(0);
    this.isTypesListChange = this.editMode = false;
  }

  public addTypes(types: any[]) {
    types.forEach((type: any) => {
      type['IsActive'] = true;
    });
    this.typesPipeTrigger = new Date();
    this.isTypesListChange = true;
  }

  public deleteType(type: any, event: Event) {
    type.Data.IsActive = false;

    this.typesPipeTrigger = new Date();
    this.isTypesListChange = true;

    event.stopPropagation();
  }

  public onTypeClick(event: any) {
    this.tagsPipeTrigger = new Date();
  }

  public addTypeTags(tags: any) {
    tags.forEach((tag: any) => {
      tag['IsActive'] = true;
    });
    this.tagsPipeTrigger = new Date();
    this.isTypesListChange = true;
  }

  public deleteTypeTag(tag: any) {
    tag.Data.IsActive = false;

    this.tagsPipeTrigger = new Date();
    this.isTypesListChange = true;
  }

  public onRemoveTypeTags(tags: any[]) {
    tags.forEach((tag: any) => {
      tag.IsActive = false;
    });
    this.tagsPipeTrigger = new Date();
  }

  public onAllCheckClick(event: any) {
    if (event == null) {
      this.isTypesListChange = true;
    }
  }
}
