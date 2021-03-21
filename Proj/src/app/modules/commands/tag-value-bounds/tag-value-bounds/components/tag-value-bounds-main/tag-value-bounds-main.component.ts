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
import { Subscription, Observable, forkJoin } from 'rxjs';
import { IUserGroup } from 'src/app/services/admin.module/admin.group/Models/UserGroup';
import { TagValueBoundsService } from 'src/app/services/commands/Configuration/tag-value-bounds.service';
import { TagValueBound } from 'src/app/services/commands/Models/TagValueBounds';
import { PermissionCheck } from 'src/app/core';

@Component({
  selector: 'rom-tag-value-bounds-main',
  templateUrl: './tag-value-bounds-main.component.html',
  styleUrls: ['./tag-value-bounds-main.component.less'],
})
export class TagValueBoundsMainComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public bounds: TagValueBound[];
  public isAdd: boolean;
  public isDelete: boolean;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('typeNameColumnTemplate', { static: true })
  private typeNameColumnTemplate: TemplateRef<any>;
  @ViewChild('missingEventsTemplate', { static: true })
  private missingEventsTemplate: TemplateRef<any>;
  @ViewChild('userGroupTemplate', { static: true })
  private userGroupTemplate: TemplateRef<IUserGroup>;
  sub$: Subscription;

  constructor(
    private tagValueBoundsService: TagValueBoundsService,
    private router: Router,
    private permissionCheck: PermissionCheck
  ) {}

  ngOnInit() {
    this.accessInit()
      .subscribe(results => {
        this.isAdd = results[0];
        this.isDelete = results[1];
        this.loadData();
      });    
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  private accessInit(): Observable<boolean[]> {
    const checkAccess = [
      'CFG_TAG_BOUNDS_ADD',
      'CFG_TAG_BOUNDS_DELETE'
    ];

    const obsrvs: any[] = [];
    checkAccess.forEach((access: string | string[]) => {
      obsrvs.push(this.permissionCheck.checkAuthorization(access));
    });

    return forkJoin<boolean>(obsrvs);
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = this.tagValueBoundsService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (bounds: TagValueBound[]) => {
          this.bounds = bounds;
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
      },
      {
        Name: 'GenerateMissedEvents',
        Caption: AppLocalization.GeneratingMissedEvents,
        AppendFilter: false,
        CellTemplate: this.missingEventsTemplate,
        disableTextWrap: true,
      },
      {
        Name: 'Bounds',
        Caption: AppLocalization.Limit,
        CellTemplate: this.userGroupTemplate,
        AppendFilter: false,
        disableTextWrap: true,
      },
    ];

    if (this.isDelete) {
      this.dataGrid.ActionButtons = [
        new ActionButtons(
          'Delete',
          AppLocalization.Delete,
          new ActionButtonConfirmSettings(
            AppLocalization.DeleteConfirm,
            AppLocalization.Delete
          )
        ),
      ];
    }

    this.dataGrid.DataSource = this.bounds;
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
    this.router.navigate(['commands-module/bounds/new']);
  }

  private deleteItem(itemId: number) {
    return this.tagValueBoundsService.delete(itemId);
  }
}
