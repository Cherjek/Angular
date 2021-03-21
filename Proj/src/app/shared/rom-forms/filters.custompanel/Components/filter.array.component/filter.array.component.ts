import { Component, Input, OnChanges, SimpleChanges, SimpleChange, ViewChild } from '@angular/core';
import { IFilter, FilterObjectValue } from '../../Filter';
import { ListViewFilter } from '../ListView';

@Component({
    selector: 'filter-array-component',
    templateUrl: 'filter.array.component.html'
})

export class FilterArrayComponent implements OnChanges {
    @Input() filter: IFilter;
    @Input() isClear: boolean;

    @ViewChild('listView', { static: true }) listView: ListViewFilter;

    ngOnChanges(sc: SimpleChanges) {
        //checkbox
        if (!this.filter.IsValuesSingle) {
            if (sc.isClear) {
                if ((<SimpleChange>sc.isClear).currentValue === true) {
                    this.listView.updateChecked();
                }
            }
        }
    }

    rowClick(event: any, item: any, index: number) {
        if (!this.filter.IsValuesSingle) {
            item.IsCheck = !item.IsCheck;
        }
        else {
            this.onClickRadioButton(index);
        }
    }

    public onClickRadioButton(index: number) {
        (<FilterObjectValue[]>this.filter.Data).forEach((x: any, i: number) => x.IsCheck = index === i);
    }
}