import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[detailsContentViewHost]',
    exportAs: 'detailsContentViewHost'
})
export class DetailsContentViewHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}