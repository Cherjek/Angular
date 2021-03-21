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
  SelectionRowMode,
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { IDeviceType } from 'src/app/services/data-query';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { ITagValueFilter } from 'src/app/services/objecteditors.module/Models/tags.editor/TagValueFilter';
import { LogicTagTypes } from 'src/app/services/references/models/LogicTagTypes';
import { LogicTagTypesService } from 'src/app/services/references/logic-tag-types.service';
import { TagValueBoundsService } from 'src/app/services/commands/Configuration/tag-value-bounds.service';
import { PermissionCheck } from 'src/app/core';

@Component({
  selector: 'rom-tag-value-bounds-card-logic-devices',
  templateUrl: './tag-value-bounds-card-logic-devices.component.html',
  styleUrls: ['./tag-value-bounds-card-logic-devices.component.less'],
})
export class TagValueBoundsCardLogicDevicesComponent
  implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public deviceTypes: IDeviceType[];
  public isDelete: boolean;
  filterTags: LogicTagTypes[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;

  @ViewChild('valueTypeName', { static: true })
  public valueTypeName: TemplateRef<any>;
  sub$: Subscription;

  constructor(
    private tagValueBoundsService: TagValueBoundsService,
    private logicTagTypesService: LogicTagTypesService,
    private activatedRoute: ActivatedRoute,
    private permissionCheck: PermissionCheck
  ) {
    tagValueBoundsService.idTagValueBound = this.activatedRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.accessInit()
      .subscribe(results => {
        this.isDelete = results[0];
        this.initDG();
        this.loadData();
      });    
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onActionButtonClicked(items: any) {
    items = Array.isArray(items) ? items : [items];
    const selectedItems = items.map(
      (x: { item: LogicTagTypes; Data: LogicTagTypes }) => x.item || x.Data
    );
    this.loadingContent = true;
    this.deleteItem(selectedItems)
      .then(() => {
        this.loadData();
      })
      .catch((error: any) => {
        this.errors.push(error);
        this.loadingContent = false;
      });
  }

  addFilterTag(selectedValues: LogicTagTypes[]) {
    this.loadingContent = true;
    this.tagValueBoundsService
      .postTags(selectedValues)
      .then(() => {
        this.loadData();
      })
      .catch((err) => {
        this.loadingContent = false;
        this.errors = [err];
      });
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = forkJoin([
      this.tagValueBoundsService.getTags(),
      this.logicTagTypesService.read(),
    ])
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (data: [ITagValueFilter[], LogicTagTypes[]]) => {
          this.deviceTypes = data[0];
          this.filterTags = this.filterDropdownTags(
            data[0],
            data[1]
          );
          this.dataGrid.DataSource = this.deviceTypes;
        },
        (error) => {
          this.errors = [error];
        }
      );
  }

  private filterDropdownTags(
    deviceTypes: ITagValueFilter[],
    filterTags: LogicTagTypes[]
  ) {
    return filterTags.filter(
      (tag) => !deviceTypes.find((deviceType) => deviceType.Id === tag.Id)
    );
  }

  private accessInit(): Observable<boolean[]> {
    const checkAccess = [
      'CFG_TAG_BOUNDS_TAGS_REMOVE'
    ];

    const obsrvs: any[] = [];
    checkAccess.forEach((access: string | string[]) => {
      obsrvs.push(this.permissionCheck.checkAuthorization(access));
    });

    return forkJoin<boolean>(obsrvs);
  }

  private initDG() {
    this.dataGrid.initDataGrid();
    this.dataGrid.KeyField = 'Id';
    this.dataGrid.SelectionRowMode = SelectionRowMode.Multiple;
    this.dataGrid.Columns = [
      {
        Name: 'Name',
        Caption: AppLocalization.Name,
        AppendFilter: false,
      },
      {
        Name: 'Code',
        Caption: AppLocalization.Code,
        AppendFilter: false,
      },
      {
        Name: 'ValueType',
        Caption: AppLocalization.ValueType,
        AppendFilter: false,
        AggregateFieldName: ['Name'],
        CellTemplate: this.valueTypeName,
      },
      {
        Name: 'ValueUnits',
        Caption: AppLocalization.UnitNumber,
        AppendFilter: false,
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
  }

  private deleteItem(items: any[]) {
    return this.tagValueBoundsService.deleteTags(items);
  }
}
