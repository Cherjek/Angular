import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { EquipmentService } from '../../../../services/common/Equipment.service';
import { GlobalValues, Utils } from '../../../../core';
import { TreeListItem, TreeListCheckedPanelComponent } from '../../../../shared/rom-forms/treeList.checked.panel';
import { IHierarchy, IHierarchyNodeView, ITagView, TagView } from '../../../../services/additionally-hierarchies';

export interface DataItem {
    nodes: string;
    logicDevices: string;
    tags: string;
}
interface FilterData {
    name: string;
    key: string;
}

@Component({
    selector: 'rom-data-presentation-create',
    templateUrl: './data-presentation-create.component.html',
    styleUrls: ['./data-presentation-create.component.less']
})
export class DataPresentationCreateComponent implements OnInit {

    public errors: any[] = [];
    public loadingContentPanel: boolean;
    public basketErrors: any[] = [];
    public loadingBasket: boolean;
    public changeDetection: string;

    // TreeListChecked
    public tagsTree: IHierarchyNodeView[];
    public tagsTreeGlobal: IHierarchyNodeView[];
    public treeListItems: TreeListItem[];

    // Basket
    public tagsListBasket: ITagView[];

    public filterData: FilterData[];
    public filterBy: FilterData;
    public filterQuery: string;
    public dataGridFilterQuery: string;

    @ViewChild('treelistCheckedPanel', { static: false }) treelistCheckedPanel: TreeListCheckedPanelComponent;

    private idHierarchy: number;
    public get nodesNameFiled() {
        return GlobalValues.Instance.hierarchyApp.NodesName;
    }

    constructor(private equipmentService: EquipmentService,
                private activatedRoute: ActivatedRoute,
                private utilsTree: Utils.UtilsTree) { }

    ngOnInit() {
        const idHierarchy = this.idHierarchy = this.activatedRoute.snapshot.params.id;
        const key = this.activatedRoute.snapshot.queryParams.key;

        this.filterData = [
            { name: this.nodesNameFiled, key: 'nodes'  },
            { name: AppLocalization.Equipment, key: 'logicDevices' },
            { name: AppLocalization.Tags, key: 'tags' }
        ];
        this.filterBy = this.filterData[2];

        this.loadData(idHierarchy, key);
    }

    private initTreeList() {
        const treeListItems: TreeListItem[] = [];
        this.filterData.forEach((element) => {
            treeListItems.push(new TreeListItem(element.name));
        });
        treeListItems[0].childDataName = 'LogicDevices';
        treeListItems[1].childDataName = 'Tags';
        treeListItems[2].displayField = 'Code';
        treeListItems[2].additionalField = 'Name';
        this.treeListItems = treeListItems;
    }

    private loadData(idHierarchy: number, key: string) {
        this.loadingContentPanel = true;
        this.equipmentService.getForDataPresentation(idHierarchy, key)
            .pipe(
                finalize(() => this.loadingContentPanel = false)
            )
            .subscribe(
                (response) => {
                    this.initTreeList();
                    this.tagsTreeGlobal = response;
                    this.tagsTree = this.getDataSourceClone(this.tagsTreeGlobal);
                },
                (error) => {
                    this.errors = [error];
                });
    }

    private getDataSourceClone(data: IHierarchyNodeView[]): IHierarchyNodeView[] {
        return [...data || []].map(d => {
            const newNode = {...d};
            newNode.LogicDevices = d.LogicDevices.map(ld => {
                const newLD = {...ld};
                newLD.Tags = [...ld.Tags];
                return newLD;
            });
            return newNode;
        });
    }

    /**
     * Получает массив выбранных ESO Ids, парсит в дерево
     * @param selectedRowsIds number[]
     */
    private getTagList(tree: IHierarchyNodeView[]): TagViewEx[] {
        const rec = (data: any[]): any[] => {
            let result: any = null;
            if (data != null && data.length) {
                if (data.every(d => d instanceof Array)) {
                    result = rec(data.reduce((list1: any[], list2: any[]) => [...list1, ...list2]));
                } else {
                    result = data;
                }
            }
            return result;
        }
        const result = tree.map(node => 
            node.LogicDevices.map(ld => {
                const tagsView = ld['LogicDevices'];
                return tagsView.map((tv: ITagView) => {
                    const tvex = Object.assign(new TagViewEx(), tv);
                    tvex.NodeName = node.DisplayName;
                    tvex.LogicDeviceName = ld.DisplayName;
                    return tvex;
                });
        }));
        return rec(result);
    }
    private getDataSourceReplace(data: IHierarchyNodeView[]): IHierarchyNodeView[] {
        const tagsTreeClone = this.getDataSourceClone(data);
        tagsTreeClone.forEach(node => 
            node.LogicDevices.forEach(ld => ld['LogicDevices'] = ld.Tags)
        );
        return tagsTreeClone;
    }
    public onBasketMove(selectedRowsIds: number[]): void {

        this.dataGridFilterQuery = null;

        if (!selectedRowsIds || selectedRowsIds.length === 0) {
            return;
        }

        const tagsTreeClone = this.getDataSourceReplace(this.tagsTree);

        const treeFilters: IHierarchyNodeView[] 
            = this.utilsTree.filterSourceTreeFromIds(selectedRowsIds, tagsTreeClone, 'Id', 'LogicDevices');

        const result = this.getTagList(treeFilters);

        this.tagsListBasket = [...this.tagsListBasket || [], ...result] as ITagView[];
        
        this.excludeTagsTree(this.tagsListBasket.map(t => t.Id));
    }

    public onBasketItemAdd() {

        const items = this.treelistCheckedPanel.getDataChecked<IHierarchyNodeView>();

        const tagsTreeClone = this.getDataSourceReplace(items);

        const result = this.getTagList(tagsTreeClone);

        this.tagsListBasket = [...this.tagsListBasket || [], ...result] as ITagView[];
        
        this.excludeTagsTree(this.tagsListBasket.map(t => t.Id));
    }

    private excludeTagsTree(itemsExclude: number[]) {
        let tagsTreeClone = this.getDataSourceReplace(this.tagsTreeGlobal);
        tagsTreeClone = this.utilsTree.filterSourceTreeFromIds(itemsExclude, tagsTreeClone, 'Id', 'LogicDevices');
        const tagsTreeClone2 = this.getDataSourceReplace(this.tagsTreeGlobal);
        this.utilsTree.excludeTree(tagsTreeClone, tagsTreeClone2, 'Id', 'LogicDevices');
        tagsTreeClone2.forEach(node => 
            node.LogicDevices.forEach(ld => {
                // ld.Tags = [...ld['LogicDevices'] as ITagView[]];
                delete ld['LogicDevices'];
            }
        ));
        setTimeout(() => {
            this.tagsTree = tagsTreeClone2;

            this.changeDetection = (new Date()).getTime().toString();
        });
    }

    public focusSearch(inputSearch: any) {
        setTimeout(() => inputSearch.focus(), 30);
    }

    public dropAllTags() {
        this.tagsTree = this.tagsTreeGlobal;
        this.tagsListBasket = [];
    }

    public clearItemsBasket(itemsBasket: TagViewEx[]) {
        this.tagsListBasket = this.tagsListBasket.filter((x: TagViewEx) => {
            return itemsBasket.find((y: TagViewEx) => y.Id === x.Id && y.Id === x.Id) == null;
        });

        this.excludeTagsTree(this.tagsListBasket.map(t => t.Id));
    }
}

class TagViewEx extends TagView {
    NodeName: string;
    LogicDeviceName: string;

    get ConcatField(): string {
        return `${this.Code} ${this.Name} ${this.NodeName} ${this.LogicDeviceName}`;
    }
}
