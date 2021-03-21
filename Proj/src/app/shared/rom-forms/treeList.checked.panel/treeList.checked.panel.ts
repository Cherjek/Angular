import { Component, Input, Output, EventEmitter, 
         OnDestroy, OnInit,
         OnChanges, SimpleChanges, SimpleChange, ElementRef, TemplateRef } from '@angular/core';

import { TreeListItem, ListTreeItem } from './Models';
import { TreeListCheckedService } from './services/treelist-checked.service';

import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';

import { GlobalValues } from '../../../core';

@Component({
    selector: 'treelist-checked-panel',
    templateUrl: 'treeList.checked.panel.html',
    styleUrls: ['treeList.checked.panel.css'],
    providers: [TreeListCheckedService]
})
export class TreeListCheckedPanelComponent implements OnInit, OnChanges {

    constructor(private treeListCheckedService: TreeListCheckedService,
                private elementRef: ElementRef) {
    }

    @Input() IsRemoved = true;
    @Input() IsSelected = true;
    @Input() TabViewMode = false;
    @Input() Tree: any[]; // дерево, каждый уровень дерева, это элемент массива TreeListItems
    @Input() TreeListItems: TreeListItem[];
    @Input() KeyField: string;
    @Input() DisplayField: string;
    @Input() AdditionalField: string;
    @Input() ChildDataName = 'Children';
    @Input() RowTemplate: TemplateRef<any>;

    // отступ от нижней границы
    @Input() OffsetBottom = 0;

    @Output() removeListItems = new EventEmitter<any>();
    @Output() itemChecked = new EventEmitter<any>();

    // полные списки на всех уровнях
    public get mapTreeLevel(): Map<number, ListTreeItem[]> {
        return this.treeListCheckedService.mapTreeLevel;
    }
    public set mapTreeLevel(val: Map<number, ListTreeItem[]>) {
        this.treeListCheckedService.mapTreeLevel = val;
    }
    // выделенные строки с дочерними, index и ListTreeItem(то, что выбрано)
    public mapSelectTreeLevel: Map<number, ListTreeItem>;

    public ChangeDetection: number;
    CountTotal: number; // всего записей последнего уровня дерева
    CountCheckTotal: number; // всего выбрано записей последнего уровня дерева

    private heightList: number;
    public menuTabHeader: NavigateItem[] = [];
    public menuTabSelect: NavigateItem;

    private get listViewsForm() {
        return GlobalValues.Instance.Page.ListViews;
    }

    ngOnChanges(changes: SimpleChanges): void {
        setTimeout(() => {
            if (changes.Tree) {
                if (( changes.Tree as SimpleChange).currentValue != null) {
                    this.treeListCheckedService.initTree<any>(this.Tree);
                    this.mapSelectTreeLevel = new Map();
                    this.selectDefTree(this.mapTreeLevel.get(0), 0);
                    this.updateTotal();
                    this.updateCheckTotal();
                }
            }
        }, 0);

    }

    ngOnInit(): void {
        this.treeListCheckedService.childDataName = this.ChildDataName;
        const levelChildDataName = this.TreeListItems.map(li => li.childDataName);
        if (levelChildDataName.some(item => item != null)) {
            levelChildDataName.pop();
            this.treeListCheckedService.levelChildDataName = levelChildDataName;
        }
        if (this.TabViewMode) {
            this.TreeListItems.forEach((item, index) => 
                this.menuTabHeader.push(Object.assign(new NavigateItem(), { name: item.headerText, code: index }))
            )
            this.menuTabSelect = this.menuTabHeader[0];
        }
    }

    public navClick(navItem: NavigateItem) {
        this.menuTabSelect = navItem;
    }

    private selectDefTree(listTreeItems: ListTreeItem[], level: number) {
        if (listTreeItems && listTreeItems.length) {
          listTreeItems[0].IsFocused = true;
          if (this.mapSelectTreeLevel.has(level)) {
              // снимаем выделение с предыдущего
              const itemLast = this.mapSelectTreeLevel.get(level);
              if (listTreeItems[0].Data[this.KeyField] !== itemLast.Data[this.KeyField]) {
                itemLast.IsFocused = false;
              }
          }
          this.mapSelectTreeLevel.set(level, listTreeItems[0]);
          if (listTreeItems[0].Child) {
              this.selectDefTree(listTreeItems[0].Child, level + 1);
          }
        }
    }
    private get leafs() {// самые крайние записи в дереве, листья
        const maxLevel = (this.TreeListItems || []).length;
        if (maxLevel) {
            if (this.mapTreeLevel != null && this.mapTreeLevel.has(maxLevel - 1)) {
                return (this.mapTreeLevel.get(maxLevel - 1) || []);
            }
        }

        return null;
    }
    private updateTotal() {
        if (this.leafs !== null) { this.CountTotal = this.leafs.length; }
    }
    public updateCheckTotal() {
        const items = (this.leafs || []);
        const itemsCheck = items.filter((listTreeItem: ListTreeItem) => listTreeItem.IsCheck);

        this.CountCheckTotal = (itemsCheck || []).length;
    }

    public onItemClick(item: ListTreeItem, indexPanel: number) {
        const maxLevel = (this.TreeListItems || []).length;
        for (let i = indexPanel + 1; i < maxLevel; i++) {
          this.mapSelectTreeLevel.delete(i);
        }
        this.selectDefTree([item], indexPanel);
    }

    public onItemCheckClick(item: ListTreeItem, indexPanel: number) {
        this.treeListCheckedService.itemCheckClick(item, indexPanel);

        this.ChangeDetection = (new Date()).getTime();

        this.itemChecked.emit({ item: item, indexPanel: indexPanel });
    }
    getDataChecked<T>(): T[] {
        return this.treeListCheckedService.getDataChecked<T>();
    }

    public removeListItemsClick(items: any) {
        this.removeListItems.emit(this.getDataChecked<any>());
    }

    public resizeListView(lstViewControlId: string) {
        setTimeout(() =>
            this.listViewsForm[lstViewControlId].resizeVirtualScroll(), 0);
    }
}
