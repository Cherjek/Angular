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
import { TagValueFilterService } from 'src/app/services/references/tag-value-filter.service';
import { ITagValueFilter } from 'src/app/services/objecteditors.module/Models/tags.editor/TagValueFilter';
import { LogicTagTypes } from 'src/app/services/references/models/LogicTagTypes';
import { LogicTagTypesService } from 'src/app/services/references/logic-tag-types.service';
import { PermissionCheck } from 'src/app/core';

@Component({
  selector: 'rom-filter-card-tag-types',
  templateUrl: './filter-card-tag-types.component.html',
  styleUrls: ['./filter-card-tag-types.component.less'],
  providers: [TagValueFilterService, LogicTagTypesService],
})
export class FilterCardTagTypesComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public deviceTypes: IDeviceType[];
  public isRemoveItems: boolean;
  filterTags: LogicTagTypes[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;

  @ViewChild('valueTypeName', { static: true })
  public valueTypeName: TemplateRef<any>;
  sub$: Subscription;

  constructor(
    private tagValueFilterService: TagValueFilterService,
    private logicTagTypesService: LogicTagTypesService,
    private activatedRoute: ActivatedRoute,
    private permissionCheck: PermissionCheck
  ) {
    tagValueFilterService.filterId = this.activatedRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.initDG();
    this.loadData();
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
    this.tagValueFilterService
      .post(selectedValues)
      .then(() => {
        this.loadData();
      })
      .catch((err) => {
        this.loadingContent = false;
        this.errors = [err];
      });
  }

  private accessDataGridInit(): Observable<boolean[]> {
    const checkAccess = ['CFG_TAG_FILTER_TAGS_REMOVE'];

    const obsrvs: any[] = [];
    checkAccess.forEach((access: string | string[]) => {
      obsrvs.push(this.permissionCheck.checkAuthorization(access));
    });

    return forkJoin<boolean>(obsrvs);
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = forkJoin([
      this.tagValueFilterService.get(),
      this.logicTagTypesService.read(),
    ])
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (deviceTypes: [ITagValueFilter[], LogicTagTypes[]]) => {
          this.deviceTypes = deviceTypes[0];
          this.filterTags = this.filterDropdownTags(
            deviceTypes[0],
            deviceTypes[1]
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
        Caption: AppLocalization.CountNumber,
        AppendFilter: false,
      },
    ];

    this.accessDataGridInit().subscribe((results: boolean[]) => {
      if (results[0]) {
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
      this.isRemoveItems = results[0];
    });    
  }

  private deleteItem(items: any[]) {
    return this.tagValueFilterService.delete(items);
  }
}
