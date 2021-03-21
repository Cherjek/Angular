import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataGrid } from '../../../../../controls/DataGrid/DataGrid';
import { map, tap, finalize } from 'rxjs/operators';

import { SelectionRowMode as DGSelectionRowMode } from '../../../../../controls/DataGrid/DataGridBase';

import { ActionButtons as DGActionButton } from '../../../../../controls/DataGrid/DataGridBase';
import { ActionButtonConfirmSettings as DGActionButtonConfirmSettings } from '../../../../../controls/DataGrid/DataGridBase';
import { HierarchyTypeEditorService, 
         HierarchyPropertyService, 
         IHierarchyNodeTypePropertyCategory } from '../../../../../services/additionally-hierarchies';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PermissionCheck } from '../../../../../core';

@Component({
    selector: 'ahm-type-node-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.less'],
})
export class CategoriesComponent implements OnInit {
    public loadingContent: boolean;
    public errors: any[] = [];
    public typeNodeId: number;

    private _destructor = new Subject();

    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;

    constructor(
        private hierarchyPropertyService: HierarchyPropertyService,
        private hierarchyTypeEditorService: HierarchyTypeEditorService,
        private router: Router,
        private activateRoute: ActivatedRoute,
        private permissionCheck: PermissionCheck
    ) { }

    ngOnInit() {
        this.loadingContent = true;
        this.activateRoute.parent.params.pipe(takeUntil(this._destructor)).subscribe(params => {
            this.typeNodeId = params['id'];
            this.loadData();
        });
    }

    ngOnDestroy(): void {
        this._destructor.next();
        this._destructor.complete();
    }

    private loadData() {
        this.hierarchyTypeEditorService
            .getPropertiesСategories(this.typeNodeId)
            .pipe(takeUntil(this._destructor))
            .subscribe(
                (nodes: IHierarchyNodeTypePropertyCategory[]) => {
                    this.initDG(nodes);
                    this.loadingContent = false;
                },
                error => {
                    this.errors = [error];
                    this.loadingContent = false;
                },
            );
    }

    private initDG(nodes: IHierarchyNodeTypePropertyCategory[]) {
        this.dataGrid.initDataGrid();
        this.dataGrid.SelectionRowMode = DGSelectionRowMode.Multiple;

        this.dataGrid.KeyField = 'Id';
        this.dataGrid.Columns = [
            {
                Name: 'Name',
                Caption: AppLocalization.CategoryName,
            },
        ];

        this.permissionCheck.checkAuthorization('HH_TYPE_CATEGORY_DELETE')
            .subscribe(authorized => {
                if (authorized) {
                    this.dataGrid.ActionButtons = [
                        new DGActionButton(
                            'Delete',
                            AppLocalization.Delete,
                            new DGActionButtonConfirmSettings(AppLocalization.DeleteCategoryAlert, AppLocalization.Delete),
                        ),
                    ];
                }
            });

        this.dataGrid.DataSource = nodes;
    }

    public addCategory() { 
        this.router.navigate(['/hierarchies-module/category-property-card/', 'new'], { queryParams: { idTypeNode: this.typeNodeId } });
    }

    public onDGRowActionBttnClick(event: any) {
        const category =  event.item as IHierarchyNodeTypePropertyCategory;
        switch (event.action) {
            case 'Delete':
                this.deleteHierarchiesAsync([category.Id]);
                break;
        }
    }

    public deleteDGRows() {
        const ids = this.dataGrid.getSelectDataRows().map(item => item[this.dataGrid.KeyField]);
        this.deleteHierarchiesAsync(ids);
    }

    private deleteHierarchiesAsync(ids: number[]) {
        this.loadingContent = true;
        this.hierarchyPropertyService
            .deleteHierarchyNodeTypePropertyCategoriesAsync(ids)
            .then((res: any) => {
                this.loadData(); // ререндерим заново строки с бэкенда
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
}
