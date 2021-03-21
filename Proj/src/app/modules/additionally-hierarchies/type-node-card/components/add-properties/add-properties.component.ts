import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataGrid } from '../../../../../controls/DataGrid/DataGrid';

import { SelectionRowMode as DGSelectionRowMode } from '../../../../../controls/DataGrid/DataGridBase';

import { ActionButtons as DGActionButton } from '../../../../../controls/DataGrid/DataGridBase';
import { ActionButtonConfirmSettings as DGActionButtonConfirmSettings } from '../../../../../controls/DataGrid/DataGridBase';
import { HierarchyTypeEditorService,
         HierarchyPropertyService,
         IHierarchyNodeTypePropertyType } from 'src/app/services/additionally-hierarchies';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PermissionCheck } from '../../../../../core';

@Component({
    selector: "ahm-add-properties",
    templateUrl: './add-properties.component.html',
    styleUrls: ['./add-properties.component.less']
})
export class AddPropertiesComponent implements OnInit {
    public loadingContent: boolean;
    public errors: any[] = [];
    public typeNodeId: number;

    private _destructor = new Subject();

    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
    @ViewChild('cellNameTemplate', { static: true }) cellNameTemplate: TemplateRef<any>;
    @ViewChild('cellCategoryTemplate', { static: true }) cellCategoryTemplate: TemplateRef<any>;

    constructor(
        private hierarchyPropertyService: HierarchyPropertyService,
        private hierarchyTypeEditorService: HierarchyTypeEditorService,
        private router: Router,
        private activateRoute: ActivatedRoute,
        private permissionCheck: PermissionCheck
    ) { }

    ngOnInit() {
        this.loadingContent = true;
        this.activateRoute.parent.params
            .pipe(takeUntil(this._destructor))
            .subscribe(params => {
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
            .getAdditionalProperties(this.typeNodeId)
            .pipe(takeUntil(this._destructor))
            .subscribe(
                (nodes: IHierarchyNodeTypePropertyType[]) => {
                    this.initDG(nodes);
                    this.loadingContent = false;
                },
                error => {
                    this.errors = [error];
                    this.loadingContent = false;
                }
            );
    }

    private initDG(nodes: IHierarchyNodeTypePropertyType[]) {
        this.dataGrid.initDataGrid();
        this.dataGrid.SelectionRowMode = DGSelectionRowMode.Multiple;

        this.dataGrid.KeyField = 'Id';
        this.dataGrid.Columns = [
            {
                Name: 'Name',
                Caption: AppLocalization.NameAdditionProps,
                CellTemplate: this.cellNameTemplate
            },
            {
                Name: 'Category',
                AggregateFieldName: ['Name'],
                Caption: AppLocalization.Category,
                CellTemplate: this.cellCategoryTemplate
            },
            {
                Name: 'Code',
                Caption: AppLocalization.Code
            }
        ];

        this.permissionCheck.checkAuthorization('HH_TYPE_PROPERTY_DELETE')
            .subscribe(authorized => {
                if (authorized) {
                    this.dataGrid.ActionButtons = [
                        new DGActionButton(
                            'Delete',
                            AppLocalization.Delete,
                            new DGActionButtonConfirmSettings(
                                AppLocalization.DeleteAdditPropAlert,
                                AppLocalization.Delete
                            )
                        )
                    ];
                }
            });

        this.dataGrid.DataSource = nodes;
    }

    public addAdditionalProperty() { 
        this.router.navigate(['/hierarchies-module/additionally-property-card/', 'new'], { queryParams: { idTypeNode: this.typeNodeId } });
    }

    public onDGRowActionBttnClick(event: any) {
        const addProp =  event.item as IHierarchyNodeTypePropertyType;
        switch (event.action) {
            case 'Delete':
                this.deleteHierarchiesAsync([addProp.Id]);
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
            .deleteHierarchyNodeTypePropertyTypesAsync(ids)
            .then((res: any) => {
                this.loadData(); // ререндерим заново строки с бэкенда
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
}
