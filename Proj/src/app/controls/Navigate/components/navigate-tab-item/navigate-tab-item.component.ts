import { Component, Input } from '@angular/core';
import { NavigateItem } from '../../../../common/models/Navigate/NavigateItem';

@Component({
    selector: 'navigate-tab-item',
    templateUrl: './navigate-tab-item.component.html',
    styleUrls: ['./navigate-tab-item.component.less']
})
export class NavigateTabItemComponent {
    @Input() navItem: NavigateItem;
    @Input() isActive: boolean;
}