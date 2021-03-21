import { Pipe, PipeTransform } from '@angular/core';
import { FilterRowPipe } from "../../../shared/rom-pipes/filter-row.pipe";
import { ListItem } from '../ListView';

@Pipe({
    name: 'filterListRow'
})
export class ListViewFilterRow extends FilterRowPipe {
    transform(items: ListItem[], keyField: string, filters?: string | Object): any {

        if (items && items.length && filters) {
            let result = items.map(item => item.Data);
            let filterResults = (super.transform(result, null, filters) || []).map((r: any) => r[keyField]);
            return items.filter(item => {
                return (
                    filterResults.find((fr: any) => fr === item.Data[keyField]) != null
                )
            });
        }

        return items;
    }
}