import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, tap, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { HierarchyPropertyService,
         HierarchyTypeEditorService,
         INodeType } from '../../../../../services/additionally-hierarchies';
import {
    DataGrid,
    SelectionRowMode as DGSelectionRowMode,
    ActionButtons as DGActionButton,
    ActionButtonConfirmSettings as DGActionButtonConfirmSettings
} from '../../../../../controls/DataGrid';
import { PermissionCheck } from '../../../../../core';

@Component({
    selector: 'ahm-type-nodes',
    templateUrl: './type-nodes.component.html',
    styleUrls: ['./type-nodes.component.less']
})
export class TypeNodesComponent implements OnInit {

    public loadingContent: boolean;
    public errors: any[] = [];

    private nodeTypes: INodeType[];
    public idHierarchy: number;
    private subscription: Subscription;

    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
    @ViewChild('cellNameTemplate', { static: true }) private cellNameTemplate: TemplateRef<any>;

    constructor(private hierarchyPropertyService: HierarchyPropertyService,
                private hierarchyTypeEditorService: HierarchyTypeEditorService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private permissionCheck: PermissionCheck) {
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.idHierarchy = params.id;

            this.loadData();
        });
    }

    ngOnInit() { }

    private loadData() {
        this.loadingContent = true;
        this.hierarchyTypeEditorService.getNodeTypes(this.idHierarchy)
            .pipe(
                finalize(() => {
                    this.loadingContent = false;
                })
            )
            .subscribe(
                (data: INodeType[]) => {
                    this.nodeTypes = data;
                    this.initDG(this.nodeTypes);
                },
                (error: any) => {
                    this.errors = [error];
                }
            );
    }

    private initDG(nodes: INodeType[]) {
        this.dataGrid.initDataGrid();
        this.dataGrid.SelectionRowMode = DGSelectionRowMode.Multiple;

        this.dataGrid.KeyField = 'Id';
        this.dataGrid.Columns = [
            {
                Name: 'Name',
                Caption: AppLocalization.Name,
                CellTemplate: this.cellNameTemplate
            },
            {
                Name: 'NodeName',
                Caption: AppLocalization.TheNameOfTheSite
            },
            {
                Name: 'Description',
                Caption: AppLocalization.Description
            }
        ];

        this.permissionCheck.checkAuthorization('HH_TYPE_DELETE')
            .subscribe(authorized => {
                if (authorized) {
                    this.dataGrid.ActionButtons = [
                        new DGActionButton(
                            'Delete',
                            AppLocalization.Delete,
                            new DGActionButtonConfirmSettings(AppLocalization.DeleteNodeTypeAlert, AppLocalization.Delete))
                    ];
                }
            });

        this.dataGrid.DataSource = nodes;
    }

    public addTypeNode() {
        this.router.navigate(['/hierarchies-module/type-node-card/new'], { queryParams: { idHierarchy: this.idHierarchy } });
    }

    public onDGRowActionBttnClick(event: any) {
        const nodeType =  event.item as INodeType;
        switch (event.action) {
            case 'Delete':
                this.deleteHierarchiesAsync([nodeType.Id]);
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
            .deleteHierarchyNodeTypesAsync(ids)
            .then((res: any) => {
                this.loadData(); // ререндерим заново строки с бэкенда
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
}
