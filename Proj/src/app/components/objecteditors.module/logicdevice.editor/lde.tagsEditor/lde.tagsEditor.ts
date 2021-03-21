import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Observer } from "rxjs";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TagsEditorService } from "../../../../services/objecteditors.module/tags.editor/TagsEditor.service";
import { TagView, LogicTagTypeView, DeviceInfoView, TagScriptView, IObject } from "../../../../services/objecteditors.module/Models/tags.editor/_tagsEditorModels";

import { LogicDeviceEditorTagsService } from "../../../../services/objecteditors.module/logicDevice.editor/lde.tags/LogicDeviceEditorTags";

import { GlobalValues } from '../../../../core';

const __keyTagType = "TagType";
const __keyDevice_Script = "Device_Script";
const __keyDeviceTagType_ScriptVariable = "DeviceTagType_ScriptVariable";
const __keyThreshold = "Threshold";
const _keyValueFilter = 'TagValueFilter';
const __keySubSystem = 'SubSystem';

@Component({
  selector: 'lde-tags-editor',
  templateUrl: './lde.tagsEditor.html',
  styleUrls: ['./lde.tagsEditor.css'],
  providers: [TagsEditorService],
})
export class LDETagsEditorComponent implements OnInit, OnDestroy {
  ldeTags$: Subscription;
  modeForm: string;
  isPropEdit: boolean;
  viewTags: any[];
  ldId: number;
  mode: string;
  ids: string;
  unitId: number;
  tags: any[];
  tagType: number;
  script: any;
  rollBackChangeDetect: number;
  public loadingContent: boolean;
  public errorsContent: any[] = [];
  private subscription: Subscription;
  private subscriptionQuery: Subscription;

  constructor(
    private activateRoute: ActivatedRoute,
    private ldeTagsService: LogicDeviceEditorTagsService,
    private tagsEditorService: TagsEditorService
  ) {
    if (
      activateRoute.snapshot.data &&
      activateRoute.snapshot.data.mode &&
      activateRoute.snapshot.data.mode === 'child'
    ) {
      this.modeForm = activateRoute.snapshot.data.mode;
      this.ldId = activateRoute.parent.snapshot.params.id;
      this.mode = activateRoute.parent.snapshot.queryParams.mode;
      this.ids = activateRoute.parent.snapshot.queryParams.ids;
      this.unitId = activateRoute.parent.snapshot.queryParams.unitId;
    } else {
      this.subscription = activateRoute.params.subscribe((params) => {
        this.ldId = params['id'];
        this.subscriptionQuery = this.activateRoute.queryParams.subscribe(
          (qparams: any) => {
            this.mode = qparams['mode'];
            this.ids = qparams['ids'];
          }
        );
      });
    }
  }  

  @ViewChild('tagsEditorComponent', { static: true }) tagsEditorComponent: any;
  @ViewChild('appTagsParams', { static: true }) appTagsParams: any;

  public get isNew() {
    return this.mode === 'new';
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    if (this.ids != null) {
      this.loadingContent = true;
      this.ldeTags$ = this.ldeTagsService
        .getTagsWithFilter(this.ldId, this.ids)
        .subscribe(
          (tags: any) => {
            this.tags = tags;
            this.loadingContent = false;
            this.isPropEdit = false;
            this.createViewTags(tags);
          },
          (error: any) => {
            this.loadingContent = false;
            this.errorsContent.push(error);
          }
        );
    }
  }

  createViewTags(tags: any[]) {
    if (this.modeForm != null && tags && tags.length) {
      this.tagType = tags[0][__keyTagType].Id;
      const nameFirst = __keyDevice_Script.split('_');
      const val1 = (tags[0][nameFirst[0]] || tags[0][nameFirst[1]]);
      const nameSecond = __keyDeviceTagType_ScriptVariable.split('_');
      const val2 = (tags[0][nameSecond[0]] || tags[0][nameSecond[1]]);
      this.viewTags = [
        {
          Caption: AppLocalization.Label51,
          Value: tags[0]['LogicTagType'] != null ? `${tags[0]['LogicTagType']['Code']}, ${tags[0]['LogicTagType']['Name']}` : ''
        },
        {
          Caption: AppLocalization.Type,
          Value: tags[0][__keyTagType] != null ? tags[0][__keyTagType]['Name'] : ''
        },
        {
          Caption: AppLocalization.Source,
          Value: val1 != null ? val1['Name'] : ''
        },
        {
          Caption: AppLocalization.MeasuringChannel,
          Value: val2 != null ? val2['Name'] : ''
        },
        {
          Caption: AppLocalization.Limitations,
          Value: tags[0][__keyThreshold] != null ? tags[0][__keyThreshold]['Name'] : ''
        },
        {
          Caption: AppLocalization.Filter,
          Value: tags[0][_keyValueFilter] != null ? tags[0][_keyValueFilter]['Name'] : ''
        },
        {
          Caption: AppLocalization.Subsystem,
          Value: tags[0][__keySubSystem] != null ? tags[0][__keySubSystem]['Name'] : ''
        },
      ];
    }
  }

  ngOnDestroy() {
    this.unsubscriber([
      this.subscription,
      this.subscriptionQuery,
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

  save(tagsView: TagView[], appTagsParams?: any) {
    const request = {
      IdLogicDevice: this.ldId,
      Method: this.mode,
      Tags: tagsView,
    };

    const errors: string[] = [];
    tagsView.forEach((tv) => {
      const pattern = `${tv.LogicTagType.Code} ${tv.LogicTagType.Name}, ${tv.TagType.Name}:`;
      const errorCheck = (val1: any, val2: any) => {
        const errorsField: string[] = [];
        if (val1 == null) {
          errorsField.push(AppLocalization.Source.toLowerCase());
        }
        if (val2 == null) {
          errorsField.push(AppLocalization.MeasuringChannel.toLowerCase());
        }
        if (errorsField.length) {
          errors.push(`${pattern} ${AppLocalization._not_choose} ${errorsField.join(', ')}`);
        }
      };
      if (tv.TagType.Id === 0) {
        errorCheck(tv.Device, tv.DeviceTagType);
      } else {
        errorCheck(tv.Script, tv.ScriptVariable);
      }
    });
    if (errors.length) {
      this.errorsContent = errors;
      return;
    }

    this.loadingContent = true;

    this.tagsEditorService
      .post(request)
      .then((result: any) => {
        this.loadingContent = false;
        this.cancel();
        if (appTagsParams != null) {
          appTagsParams.isPropEdit = false;
        }
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errorsContent.push(error);
      });
  }
  cancel() {
    if (this.modeForm == null)
      GlobalValues.Instance.Page.backwardButton.navigate();
    else this.rollbackPropertyChanges();
  }

  changeTagColumn(tagColumn: any) {
    if (tagColumn.col === "TagType") {
      this.tagType = tagColumn.val.Id;
    } else if (tagColumn.col === "Device_Script") {
      this.script = tagColumn.val;
    }
  }

  changeProperties() {
    this.isPropEdit = true;
  }

  rollbackPropertyChanges() {
    this.loadData();
    this.rollBackChangeDetect = new Date().getTime();
  }
}
