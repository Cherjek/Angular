import { Component, Input } from '@angular/core';
import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';

@Component({
     selector: 'rom-forms__navigate-item-template',
     templateUrl: './navigate-item-template.component.html',
     styleUrls: ['./navigate-item-template.component.less']
})
export class NavigateItemTemplateComponent {
    @Input() navItem: NavigateItem;
    @Input() isTabView = false;
    @Input() activeTab: string;
}