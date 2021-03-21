import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScriptEditorService } from 'src/app/services/script-editor/script-editor.service';
import { IScriptEditor } from 'src/app/services/script-editor/model/script-editor';
import { PermissionCheckUtils } from 'src/app/core';

@Component({
  selector: 'rom-script-editor-main',
  templateUrl: './script-editor-main.component.html',
  styleUrls: ['./script-editor-main.component.less'],
})
export class ScriptEditorMainComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public scriptEditors: IScriptEditor[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('typeNameColumnTemplate', { static: true })
  private typeNameColumnTemplate: TemplateRef<any>;
  sub$: Subscription;

  constructor(
    private permissionCheckUtils: PermissionCheckUtils,
    private scriptEditorService: ScriptEditorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = this.scriptEditorService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (scriptEditors: IScriptEditor[]) => {
          this.scriptEditors = scriptEditors;
          this.initDG();
        },
        (error) => {
          this.errors = [error];
        }
      );
  }

  private initDG() {
    this.dataGrid.initDataGrid();
    this.dataGrid.KeyField = 'Id';

    this.dataGrid.Columns = [
      {
        Name: 'Name',
        Caption: AppLocalization.Name,
        CellTemplate: this.typeNameColumnTemplate,
        AppendFilter: false,
        disableTextWrap: true,
        Width: '300'
      },
      {
        Name: 'Text',
        Caption: AppLocalization.Text,
        AppendFilter: false,
        disableTextWrap: true,
      },
    ];
    this.permissionCheckUtils
          .getAccess([
            'REF_EDIT_SCRIPTS'
          ], [
            new ActionButtons(
              'Delete',
              AppLocalization.Delete,
              new ActionButtonConfirmSettings(
                AppLocalization.DeleteConfirm,
                AppLocalization.Delete
              )
            )
          ])
          .subscribe(result => this.dataGrid.ActionButtons = result);
    this.dataGrid.DataSource = this.scriptEditors;
  }

  onActionButtonClicked(event: any) {
    const itemId = event.item.Id;
    this.loadingContent = true;
    this.deleteItem(itemId)
      .then(() => {
        this.dataGrid.DataSource = (this.dataGrid.DataSource || []).filter(
          (item) => {
            if (item) {
              return item.Id !== itemId;
            }
          }
        );
        this.loadingContent = false;
      })
      .catch((error: any) => {
        this.errors.push(error);
        this.loadingContent = false;
      });
  }

  addNewItem() {
    this.router.navigate(['script-editors/new']);
  }

  private deleteItem(itemId: number) {
    return this.scriptEditorService.delete(itemId);
  }
}
