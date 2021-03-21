import { AppLocalization } from 'src/app/common/LocaleRes';
import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    OnDestroy
} from '@angular/core';

import {
    ActionButtonConfirmSettings as DGActionButtonConfirmSettings,
    ActionButtons as DGActionButton
} from '../../../../controls/DataGrid/DataGridBase';

import { SelectionRowMode } from '../../../../controls/DataGrid/DataGridBase';
import { Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataGrid } from 'src/app/controls/DataGrid';
import { HierarchiesService, HierarchyPropertyService, IHierarchy } from 'src/app/services/additionally-hierarchies';
import { NavigateItem } from '../../../../common/models/Navigate/NavigateItem';
import { PermissionCheck, AccessDirectiveConfig } from '../../../../core';

@Component({
    selector: "ahm-hierarchies",
    templateUrl: './hierarchies.component.html',
    styleUrls: ['./hierarchies.component.less']
})
export class HierarchiesComponent implements OnInit, OnDestroy {
    public loadingContent: boolean;
    public errors: any[] = [];
    public navigateMenuTabs: NavigateItem[] = [];
    private hierarchies: IHierarchy[] = [];
    private _destructor = new Subject();
    private tabCodeSelect = 'all';

    // private DGSelectionRowMode = SelectionRowMode;

    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
    @ViewChild('HierarchyColumnTemplate', { static: true })
    private hierarchyColumnTemplate: TemplateRef<any>;
    @ViewChild('NavigateMenu', { static: true }) private navigateMenu: any;

    constructor(
        private permissionCheck: PermissionCheck,
        private hierarchyPropertyService: HierarchyPropertyService,
        private hierarchiesService: HierarchiesService,
        private router: Router
    ) { }

    ngOnInit() {
        this.initMenu();
    }

    ngOnDestroy(): void {
        this._destructor.next();
        this._destructor.complete();
    }

    public onNavSelectChanged(tab: any) {
        this.tabCodeSelect = tab.code;
        this.dataGrid.DataSource = this.filterData();
    }

    private accessContextMenuInit() {

        const checkAccess = [
            'HH_ALLOW',
            'HH_ALLOW_PERSONAL'
        ];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[] | AccessDirectiveConfig) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        return forkJoin(obsrvs);
    }

    private initMenu() {
        
        this.accessContextMenuInit()
            .subscribe((response: any[]) => {

                const menus: NavigateItem[] = [];

                if (response[0] && response[1]) {
                    menus.push(
                        Object.assign(new NavigateItem(), {
                            name: AppLocalization.All,
                            code: 'all',
                            isActive: true
                        })
                    );
                }
                if (response[0]) {
                    menus.push(
                        Object.assign(new NavigateItem(), {
                            name: AppLocalization.SystemWide,
                            code: 'system-wide',
                        })
                    );
                }
                if (response[1]) {
                    menus.push(
                        Object.assign(new NavigateItem(), {
                            name: AppLocalization.Label53,
                            code: 'personal'
                        })
                    );
                }

                this.navigateMenuTabs = menus;

                if (!(response[0] && response[1])) {
                    this.tabCodeSelect = response[0] ? 'system-wide' :
                                            response[1] ? 'personal' : '';
                }
                this.loadData();
            });
        
    }

    private filterData(): IHierarchy[] {
        this.dataGrid.Filter = null;
        switch (this.tabCodeSelect) {
            case 'all':
                return this.hierarchies;
            case 'system-wide':
                return this.hierarchies.filter(i => !i.IsPersonal);
            case 'personal':
                return this.hierarchies.filter(i => i.IsPersonal);
            default:
                return [];
                break;
        }
    }

    private loadData() {
        this.loadingContent = true;
        this.hierarchiesService
            .get()
            .pipe(takeUntil(this._destructor))
            .subscribe(
                (hierarchies: IHierarchy[]) => {
                    this.hierarchies = hierarchies;
                    this.initDG(hierarchies);
                    this.loadingContent = false;
                },
                error => {
                    this.errors = [error];
                    this.loadingContent = false;
                }
            );
    }
    
    private initDG(hierarchies: any[]) {
        // this.accessDataGridInit().subscribe((results: boolean[]) => {

        this.dataGrid.initDataGrid();
        this.dataGrid.KeyField = 'Id';
        this.dataGrid.SelectionRowMode = SelectionRowMode.Multiple;

        this.permissionCheck.checkAuthorization('HH_DELETE')
            .subscribe(authorized => {
                if (authorized) {
                    this.dataGrid.ActionButtons = [
                        new DGActionButton(
                            'Delete',
                            AppLocalization.Delete,
                            new DGActionButtonConfirmSettings(
                                AppLocalization.DeleteHierarchyAlert,
                                AppLocalization.Delete
                            )
                        )
                    ];
                }
            });

        this.dataGrid.Columns = [
            {
                Name: 'Name',
                Caption: AppLocalization.TheNameOfTheHierarchy,
                CellTemplate: this.hierarchyColumnTemplate,
                AppendFilter: false,
                disableTextWrap: true
            },
            {
                Name: 'Description',
                Caption: AppLocalization.Label40,
                AppendFilter: false,
                disableTextWrap: true
            }
        ];

        this.dataGrid.DataSource = this.filterData();
        // });
    }

    private deleteHierarchy(hierarchyId: number) {
        this.hierarchiesService.delete(hierarchyId);
        this.loadData();
    }

    public addNewHierarchy() {
        this.router.navigate(['hierarchies-module/hierarchy-card/new']);
    }

    public onDGRowActionBttnClick(event: any) {
        const hierarchy =  event.item as IHierarchy;
        switch (event.action) {
            case 'Delete':
                this.deleteHierarchiesAsync([hierarchy.Id]);
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
            .deleteHierarchiesAsync(ids)
            .then((res: any) => {
                this.loadData(); // ререндерим заново строки с бэкенда
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
}
