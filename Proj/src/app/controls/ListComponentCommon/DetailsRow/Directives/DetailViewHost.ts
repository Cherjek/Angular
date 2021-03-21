import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[detailViewHost]',
    exportAs: 'detailViewHost'
})
export class DetailViewHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}