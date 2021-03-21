import { Component, Input } from '@angular/core';
import { NavigateItem } from '../../../../common/models/Navigate/NavigateItem';

@Component({
    selector: 'navigate-route-item',
    templateUrl: './navigate-route-item.component.html',
    styleUrls: ['./navigate-route-item.component.less']
})
export class NavigateRouteItemComponent {
    @Input() navItem: NavigateItem;
}