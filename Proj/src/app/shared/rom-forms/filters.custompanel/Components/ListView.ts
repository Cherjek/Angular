import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

import { FilterObjectValue } from '../Filter';

@Directive({
    selector: '[listViewFilter]',
    exportAs: 'listViewFilter'
})
export class ListViewFilter implements OnChanges {

    constructor(elRef: ElementRef) { }

    @Input() DataSource: any[];

    Length: number;
    IsAllSelect: boolean;
    IsNotAllSelect: boolean;

    ngOnChanges() {
        this.Length = (this.DataSource || []).length;
        this.updateChecked();
    }

    updateChecked() {
        let checkList = (<FilterObjectValue[]>(this.DataSource || [])).filter(x => x.IsCheck);
        this.IsAllSelect = (checkList || []).length === this.Length;
        this.IsNotAllSelect = (checkList || []).length > 0;
    }

    checked(check: boolean) {
        this.IsAllSelect = check;
        this.IsNotAllSelect = false;
        (this.DataSource || []).forEach((x: any) => x.IsCheck = check);
    }

    getChecked() {
        return (<FilterObjectValue[]>(this.DataSource || [])).filter(x => x.IsCheck);
    }
}