import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { IMatTreeActionButton } from '../../models/MatTreeActionButton';
import { IMatTreeActionButtonEmit, MatTreeActionButtonEmit } from '../../models/MatTreeActionButtonEmit';

@Component({
    selector: 'mat-tree-action-buttons',
    templateUrl: './mat-tree-action-buttons.component.html',
    styleUrls: ['./mat-tree-action-buttons.component.less']
})
export class MatTreeActionButtonsComponent {
    
    @Output() menuClick = new EventEmitter<IMatTreeActionButtonEmit>();
    @ViewChild('popUpActionButton', { static: true }) popUpActionButton: any;

    @Input() actionButtons: IMatTreeActionButton[];

    public actionButton: IMatTreeActionButton;

    public actionButtonMenuClicked(menuItem: IMatTreeActionButton) {
        if (menuItem.isConfirm) {
            this.actionButton = menuItem;
        } else {
            this.apply(menuItem);
        }
    }

    public apply(menuItem: IMatTreeActionButton) {
        const emit = new MatTreeActionButtonEmit();
        emit.event = menuItem.code;
        this.menuClick.emit(emit);
        this.popUpActionButton.close();
    }

    public openActionButtonPopover(event: MouseEvent) {
        if (!this.popUpActionButton.isOpen()) {
            if (window.innerHeight - event.y < 100) {
                this.popUpActionButton.placement = 'top-right';
            } else {
                this.popUpActionButton.placement = 'left';
            }
            this.popUpActionButton.open();
        } else {
            this.popUpActionButton.close();
        }
    }

    public hiddenEventActionButtonPopover() {
        this.actionButton = null;
    }
}