import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import * as NavigateNamespace from '../../common/models/Navigate/Navigate';
import { NavigateItem } from '../../common/models/Navigate/NavigateItem';

@Component({
    selector: 'navigate-menu-ro5',
    templateUrl: 'navigate-menu-ro5.component.html',
    styleUrls: ['navigate-menu-ro5.component.less']
})
export class Navigate {
    private get navigateSelectItem() {
        return this.navigate.selectItem;
    }
    private set navigateSelectItem(item: NavigateItem) {
        this.navigate.selectItem = item;
    }
    navigate: NavigateNamespace.Navigate;
    @Input() templateNavItem: TemplateRef<any>;
    @Input() isTabView = false; // по умолчанию используется как навигация по url, isTabView позволяет использовать как Tab панель
    @Input() activeTab: string;
    @Input() height = 50;
    @Input() set items(items: NavigateItem[]) {
        this.navigate.items = items;
        // всегда по умолчанию первый элемент,
        // selectItem может не использоваться, потому этот код должен быть
        if (items && items.length) {
            const navItem = items.find(x => x.isActive || (this.activeTab != null ? x.code === this.activeTab : false));
            this.navigateSelectItem = navItem ? navItem : items[0];
        }
    }
    @Output() onNavSelectChanged = new EventEmitter<any>();

    constructor() {
        this.navigate = new NavigateNamespace.Navigate();
    }

    public onItemClick(item: NavigateItem): void {
        this.navigateSelectItem = item;
        this.onNavSelectChanged.emit(item);
    }
}
