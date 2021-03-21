import { Injectable } from '@angular/core';
import { TreeListItem, ListTreeItem } from '../Models';

@Injectable({
    providedIn: 'root'
})
export class TreeListCheckedService {

    // полные списки на всех уровнях
    mapTreeLevel: Map<number, ListTreeItem[]>;
    childDataName = 'child';
    levelChildDataName: string[];

    private getCurrentChildDataName(level: number) {
        if (this.levelChildDataName != null) {
            if (this.levelChildDataName.length > level) {
                if (this.levelChildDataName[level] != null) {
                    return this.levelChildDataName[level];
                }
            }
        }

        return this.childDataName;
    }
    private recursiveInitListTree<T>(tree: T[], level: number, parent: ListTreeItem = null) {

        const childDataName = this.getCurrentChildDataName(level);
        const listTreeItems = new Array<ListTreeItem>();

        (tree || []).forEach((item: any) => {

            const listTreeItem = new ListTreeItem();
            listTreeItem.Data = item;
            if (parent != null) {
                listTreeItem.Parent = parent;
            }
            if (item[childDataName] != null) {
                listTreeItem.Child = this.recursiveInitListTree(item[childDataName], level + 1, listTreeItem);
            }

            listTreeItems.push(listTreeItem);
        });

        if (!this.mapTreeLevel.has(level)) {
            this.mapTreeLevel.set(level, listTreeItems);
        } else {
            this.mapTreeLevel.set(level, [...this.mapTreeLevel.get(level), ...listTreeItems]);
        }

        return listTreeItems;
    }

    initTree<T>(data: T[]) {
        this.mapTreeLevel = new Map();
        this.recursiveInitListTree<T>(data, 0);
    }

    private recursiveChildCheck(check: boolean, listTreeItems: ListTreeItem[]) {
        (listTreeItems || []).forEach((listTreeItem: ListTreeItem) => {

            listTreeItem.IsCheck = check;

            if (listTreeItem.Child) {
                this.recursiveChildCheck(check, listTreeItem.Child);
            }

        });
    }
    private recursiveParentIndeterminate(listTreeItem: ListTreeItem) {
        if (listTreeItem) {

            listTreeItem.IsCheck = listTreeItem.Child.every((lstTreeItem: ListTreeItem) => (lstTreeItem.IsCheck == true));
            if (listTreeItem.IsCheck) { listTreeItem.IsIndeterminate = false; }
            else {
                // если не все выбраны
                listTreeItem.IsIndeterminate = 
                    listTreeItem.Child.some(
                        (lstTreeItem: ListTreeItem) => (lstTreeItem.IsCheck == true || lstTreeItem.IsIndeterminate == true));
            }

            if (listTreeItem.Parent) {
                this.recursiveParentIndeterminate(listTreeItem.Parent);
            }
        }
    }
    private correctChecked(listTreeItem: ListTreeItem, level: number) {
        if (listTreeItem) {
            this.recursiveChildCheck(listTreeItem.IsCheck, listTreeItem.Child);
            this.recursiveParentIndeterminate(listTreeItem.Parent);
        }
    }

    itemCheckClick(item: ListTreeItem, level: number) {
        if (item === null) {
            // множественный check в заголовке
            let checkedItems: ListTreeItem[];
            checkedItems = this.mapTreeLevel.get(level);
            checkedItems.forEach((item: ListTreeItem) => this.correctChecked(item, level));

        } else {
            this.correctChecked(item, level);
        }
    }

    getIndeterminateItems(level: number) {
        return (this.mapTreeLevel.get(level) || []).filter(item => item.IsIndeterminate);
    }

    getCheckItems(level: number) {
        return (this.mapTreeLevel.get(level) || []).filter(item => item.IsCheck);
    }

    private recursiveGetData<T>(listTreeItems: ListTreeItem[], level: number): T[] {
        const results: T[] = [];
        listTreeItems.forEach((item: ListTreeItem) => {

            const copyData =  { ...item.Data } as T;
            if (item.Child) {
                const selectChild = item.Child.filter((item: ListTreeItem) => item.IsCheck || item.IsIndeterminate);

                if (selectChild && selectChild.length) {
                    copyData[this.getCurrentChildDataName(level)] = this.recursiveGetData(selectChild, level + 1);
                }

            }

            results.push(copyData);

        });
        return results;
    }

    getDataChecked<T>(): T[] {

        if (this.mapTreeLevel.has(0)) {
            const items = this.mapTreeLevel.get(0).filter((item: ListTreeItem) => item.IsCheck || item.IsIndeterminate);
            return this.recursiveGetData(items, 0);
        }

        return null;
    }

    getTreeListItems(items: string[]): TreeListItem[] {
        const treeListItems: TreeListItem[] = [];
        (items || []).forEach(item => treeListItems.push(new TreeListItem(item)));
        return treeListItems;
    }
}