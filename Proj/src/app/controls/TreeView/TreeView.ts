import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, Input, Output, OnInit, AfterContentChecked, ViewChild, EventEmitter, ElementRef } from '@angular/core';

import { TreeviewI18n, TreeviewComponent, TreeviewItem, TreeviewConfig } from 'ngx-treeview';

declare var $: any;

@Component({
    selector: 'tree-view-ro5',
    templateUrl: 'TreeView.html',
    styleUrls: ['TreeView.css']
})

export class TreeView implements OnInit, AfterContentChecked {

    @ViewChild(TreeviewComponent, { static: true }) private treeView: TreeviewComponent;

    public loadingPanel: boolean;
    private unblockFirstSelected: boolean;
    private isFirstLoadSelected: boolean = true;
    private linqNodes = {};   
    private selectedIdNodes: any[];

    @Input() childDataName: string = "Children";//имя свойства в node, который является массивом дочерних элементов
    @Input() noName = AppLocalization._no_;
    @Input() isCheck: boolean = true;//возможность выбирать node
    @Input() isSearch: boolean = true;
    @Input() showExpandToggle = true;

    @Output() public itemSelect: EventEmitter<any> = new EventEmitter<any>();

    private _nodes: any[];
    @Input()
    get nodes() {
        return this._nodes;
    }
    set nodes(nodes: any[]) {
        let treeviewItems: TreeviewItem[];
        if (nodes) {
            treeviewItems = this.recursiveMappingToTreeviewItem(nodes);            
        }
        this._nodes = treeviewItems;
    }
    private recursiveMappingToTreeviewItem(nodes: any[], parentNode?: nodeTreeItemLink): TreeviewItem[] {

        let treeviewItems: TreeviewItem[] = [];

        nodes.forEach((node: any) => {

            let isNodeChecked: boolean = false;
            if (this.selectedIdNodes != null) {
                if (this.selectedIdNodes.find(x => x.UniqueId === node.UniqueId) != null) {
                    isNodeChecked = true;
                }
            }

            const treeviewItem: TreeviewItem = new TreeviewItem({
                text: node.Name || this.noName,
                value: node,
                checked: isNodeChecked,
                collapsed: true
            });
            treeviewItems.push(treeviewItem);
            
            let item = new nodeTreeItemLink();
            item.treeItem = treeviewItem;
            if (parentNode != null) {
                item.parent = parentNode;

                //parentNode.children = parentNode.children || [];
                //parentNode.children.push(item);                
            }
            this.linqNodes[node.UniqueId] = item;

            if (node[this.childDataName] && node[this.childDataName].length) {
                treeviewItem.children = this.recursiveMappingToTreeviewItem(node[this.childDataName], item);
            }            
        });

        return treeviewItems;
    }    

    //нужен для идентификации изменений, если vals = null, сбросить выделение в TreeView, очистить selectedNodes
    @Input()
    set selectedValuesDetectChange(vals: any[]) {
        if ((vals == null || !vals.length) && this.nodes) {
            if (this.treeView.filterItems) {
                this.treeView.allItem.checked = false;
                this.treeView.onAllCheckedChange();
            }
        }
        else {
            if (this.isFirstLoadSelected) {                
                this.isFirstLoadSelected = false;

                if (vals != null && vals.length) {

                    this.selectedIdNodes = vals;

                    let correctChecked = function (node: nodeTreeItemLink) {
                        if (node.parent) {
                            node.parent.treeItem.correctChecked();
                            correctChecked(node.parent);
                        }
                    }
                    if (Object.keys(this.linqNodes).length) {
                        vals.forEach((val: any) => {
                            let item = <nodeTreeItemLink>this.linqNodes[val.UniqueId];
                            if (item) {
                                item.treeItem.setCheckedRecursive(true);
                                correctChecked(item);
                            }
                        });
                    }
                }
            }
        }
    }
    @Input() options: TreeviewConfig;
    @Output() onSelectedChanged = new EventEmitter<any>();


    constructor(
        public i18n: TreeviewI18n,
        protected elRefTreeView: ElementRef
    ) {
        i18n.getFilterNoItemsFoundText = () => {
            return AppLocalization.NoData;
        }
    }

    ngOnInit() {
        this.treeView.i18n = this.i18n;
    }

    ngAfterContentChecked(): void { /*this.setContainerOverflowX();*/ }

    private nodeItemClick() {
        this.onSelectedChanged.emit(this.getSelectedNodes());
    }
    config = {
        hasAllCheckBox: false,
        hasFilter: false,
        hasCollapseExpand: true,
        decoupleChildFromParent: false,
        //maxHeight: 500
    }
    public filterChange(e: any) {
        
    }
    filterTextChange(text: string) {
        this.treeView.onFilterTextChange(text || '');
        this.correctChecked();
    }
    public nodeSelect(e: any) {  
        //сам компонент ngx-treeview на ngOnChanges шлет raiseSelectedChange с пустым select = [],
        //в результате если у нас что-то установлено в filter.Value сбрасывается, этим костылем блокируем этот вызов в первый раз
        if (this.unblockFirstSelected) {
            this.nodeItemClick();
        }
        else {
            this.unblockFirstSelected = true;
        }
    }
    private setContainerOverflowX() {
        $(this.elRefTreeView.nativeElement).find('.treeview-container').css({ 'overflow-x': 'auto' });
    }
    public detectRowCollapse(item: TreeviewItem) {
        this.treeView.allItem.collapsed = false;
    }

    getSelectedNodes(): any[] {
        return this.treeView.selection.checkedItems.map(x => x.value);
    }

    correctChecked() {
        this.treeView.selection.checkedItems.forEach(x => { x.checked = false; x.checked = true; });
    }

    updateTree() {
        let interval = setInterval(() => {
            if (this.treeView.filterItems) {
                clearInterval(interval);

                this.treeView.onAllCollapseExpand();
                setTimeout(() => this.loadingPanel = false, 500);

            }
        }, 0);
    }
}

class nodeTreeItemLink {
    treeItem: TreeviewItem;
    parent: nodeTreeItemLink;
    //children: nodeTreeItemLink[];
}
