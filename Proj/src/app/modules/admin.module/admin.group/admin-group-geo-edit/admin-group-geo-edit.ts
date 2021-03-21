import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs/index';
import { AdminGroupGeoService } from '../../../../services/admin.module/admin.group/AdminGroupGeo.service';
import { Utils } from '../../../../core';
import { TreeListItem, TreeListCheckedPanelComponent } from "../../../../shared/rom-forms/treeList.checked.panel";
import { GeoTree } from '../../../../services/admin.module/interfaces/geo-tree';

export interface FilterData {
    name: string; // 'Макрорегион' | 'Регион' | 'Филиал' | 'ЭСО';
    key: 'macroregion' | 'region' | 'branch' | 'eso';
}

@Component({
    selector: 'admin-group-geo-edit',
    templateUrl: './admin-group-geo-edit.html',
    styleUrls: ['./admin-group-geo-edit.less'],
    providers: [AdminGroupGeoService, Utils.UtilsTree]
})
export class AdminGroupGeoEditComponent implements OnInit, OnDestroy {
    public errors: any[] = [];
    public loadingContentPanel: boolean;
    public urlParamsSubscribe: Subscription;
    public groupId: number;
    public changeDetection: string;

    // TreeListChecked
    public geoTree: GeoTree[];
    public treeListItems: TreeListItem[];

    // Basket
    public geoPermissionsTree: GeoTree[];
    //public geoPermissionsDataGrid: GeoPermissions[];
    public checkedGeoPermissionsTree: any[];

    public filterData: FilterData[] = [
        { name: AppLocalization.Macroregion, key: 'macroregion' },
        { name: AppLocalization.Region, key: 'region' },
        { name: AppLocalization.Branch, key: 'branch' },
        { name: AppLocalization.ESO, key: 'eso' },
    ];
    public filterBy: FilterData = this.filterData[0];
    public filterQuery: string;
    public dataGridFilterQuery: string;

    @ViewChild('treelistCheckedPanel', { static: false }) treelistCheckedPanel: TreeListCheckedPanelComponent;

    constructor(public adminGroupGeoService: AdminGroupGeoService,
                public activatedRoute: ActivatedRoute,
                public router: Router,
                public utilsTree: Utils.UtilsTree) {

        this.urlParamsSubscribe = this.activatedRoute.params.subscribe(
            (params) => {
                this.groupId = params['id'];
                //разобраться, почему не работает запуск конструктора заново, при смене new на id группы
                this.loadData();
            }
        );
    }

    ngOnInit() {
        this.initTreeList();
    }

    ngOnDestroy(): void {
        this.urlParamsSubscribe.unsubscribe();
    }

    @HostListener('document:keydown', ['$event']) onKeyDownFilter(event: KeyboardEvent) {
        if (event.ctrlKey) {
            // Ctrl + s = save
            if (event.keyCode === 83) {
                event.preventDefault();
                this.save();
            }
        } else {
            if (event.keyCode === 27) {
                this.cancel();
            }
        }
    }

    public initTreeList() {
        let treeListItems: TreeListItem[] = [];
        this.filterData.forEach((element) => {
            treeListItems.push(new TreeListItem(element.name));
        });
        this.treeListItems = treeListItems;
    }

    private loadData(): void {
        this.loadingContentPanel = true;
        forkJoin(this.adminGroupGeoService.getGeoTree(this.groupId), this.adminGroupGeoService.getGeoPermissions(this.groupId)).subscribe(
            (response) => {
                this.geoTree = response[0];
                this.geoPermissionsTree = response[1];
                this.utilsTree.excludeTree(this.geoPermissionsTree, this.geoTree, "Id", "Nodes");
                this.loadingContentPanel = false;
            },
            (error) => {
                this.loadingContentPanel = false;
            }
        );
    }

    /**
     * Получает массив выбранных ESO Ids, парсит в дерево
     * @param selectedRowsIds number[]
     */
    public onBasketMove(selectedRowsIds: number[]): void {

        this.dataGridFilterQuery = null;

        if (!selectedRowsIds || selectedRowsIds.length === 0) {
            return;
        }
        let treeFilters: GeoTree[] = this.utilsTree.filterSourceTreeFromIds(selectedRowsIds, this.geoTree, "Id", "Nodes");

        this.onBasketItemAdd(treeFilters);
    }

    onBasketItemAdd(items?: GeoTree[]) {

        if (items == null && this.treelistCheckedPanel) {
            items = this.treelistCheckedPanel.getDataChecked<GeoTree>();
        }

        let geoTree = [...this.geoTree];
        let geoPermissionsTree = [...this.geoPermissionsTree];
        this.utilsTree.includeTree(items, geoPermissionsTree, "Id", "Nodes");
        this.utilsTree.excludeTree(items, geoTree, "Id", "Nodes");
        setTimeout(() => {
            this.geoTree = geoTree;
            this.geoPermissionsTree = geoPermissionsTree;

            this.changeDetection = (new Date()).getTime().toString();
        });
    }

    onBasketItemRemove() {
        let filters = this.checkedGeoPermissionsTree.map(node => node["Id"]);
        let treeFilters = this.utilsTree.filterSourceTreeFromIds(filters, this.geoPermissionsTree, "Id", "Nodes");
        let geoTree = [...this.geoTree];
        let geoPermissionsTree = [...this.geoPermissionsTree];
        this.utilsTree.includeTree(treeFilters, geoTree, "Id", "Nodes");
        this.utilsTree.excludeTree(treeFilters, geoPermissionsTree, "Id", "Nodes");

        setTimeout(() => {
            this.geoTree = geoTree;
            this.geoPermissionsTree = geoPermissionsTree;

            this.changeDetection = (new Date()).getTime().toString();
        });
    }

    save() {
        this.loadingContentPanel = true;
        this.adminGroupGeoService
            .setGeoPermissions(<number>this.groupId, this.geoPermissionsTree)
            .then((result: any) => {
                this.loadingContentPanel = false;
                this.goBack();
            })
            .catch((error: any) => {
                this.loadingContentPanel = false;
                this.errors = [error];
            });
    }

    cancel() {
        this.goBack();
    }

    goBack() {
        this.router.navigate(['../geo'], {
            relativeTo: this.activatedRoute,
        })
    }
}
