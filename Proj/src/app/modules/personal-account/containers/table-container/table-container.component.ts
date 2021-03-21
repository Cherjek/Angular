import { Component, Input } from '@angular/core';

@Component({
    selector: 'table-container',
    templateUrl: './table-container.component.html',
    styleUrls: ['./table-container.component.less']
})
export class TableContainerComponent {

    @Input() changeSelectView: boolean;
    @Input() loadingTable: boolean = false;
    @Input() isEmptySource: boolean = false;
}