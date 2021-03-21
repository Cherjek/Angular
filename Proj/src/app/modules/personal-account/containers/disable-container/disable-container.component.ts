import { Component, Input } from '@angular/core';

@Component({
    selector: 'disable-container',
    templateUrl: './disable-container.component.html'
})
export class DisableContainerComponent {

    @Input() disabled: boolean;

}