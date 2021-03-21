import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContextButtonItem } from './ContextButtonItem';

@Component({
    selector: 'context-button',
    templateUrl: './context-button.component.html',
    styleUrls: ['./context-button.component.less']
})
export class ContextButton {
    @Input() items: ContextButtonItem[] = [];
    @Input() width: number;
    @Output() onItemClick = new EventEmitter<string>();
    public confirmButtonClick: ContextButtonItem;

    public itemClick(item: ContextButtonItem) {
        if (item.confirm != null) {
            this.confirmButtonClick = item;
        } else {
            this.onItemClick.emit(item.code);
        }
    }

    public ok() {
        this.complete();
    }

    private complete() {
        const item = this.confirmButtonClick;
        this.onItemClick.emit(item.code);
    }
}
