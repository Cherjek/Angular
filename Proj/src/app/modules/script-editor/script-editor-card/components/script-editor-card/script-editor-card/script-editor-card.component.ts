import { AppLocalization } from 'src/app/common/LocaleRes';
import { ScriptEditorService } from 'src/app/services/script-editor/script-editor.service';
import { IScriptEditor } from 'src/app/services/script-editor/model/script-editor';
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
  selector: 'rom-script-editor-card',
  templateUrl: './script-editor-card.component.html',
  styleUrls: ['./script-editor-card.component.less'],
})
export class ScriptEditorCardComponent implements OnInit, OnDestroy {
  public editorName: string;
  public editor: IScriptEditor;
  private editorId: string | number;
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
  ];
  subParam$: Subscription;

  public get isNew() {
    return this.editorId === 'new';
  }

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private scriptEditorService: ScriptEditorService
  ) {
    if (!this.isNew) {
      this.menuItems.push({
        code: 'check',
        url: 'check',
        name: AppLocalization.CheckingTheScript,
      });
    }
  }

  ngOnInit() {
    this.subParam$ = this.activateRoute.parent.params.subscribe((param) => {
      this.editorId = param.id;
    });

    this.sub$ = this.scriptEditorService
      .get(this.editorId)
      .subscribe((x: IScriptEditor) => {
        this.editor = x;
        this.editorName = `${this.editor.Name}`;
      });

    this.permissionCheckUtils
      .getAccess([
        'REF_EDIT_SCRIPTS'
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
      promise = this.scriptEditorService.delete(this.editorId as number);
      callback = (result: any) => {
        if (!result) {
          this.router.navigateByUrl('/script-editors');
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
