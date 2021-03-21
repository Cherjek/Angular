import { Pipe, PipeTransform } from '@angular/core';
import { OrderByPipe } from "../../../shared/rom-pipes/order-by.pipe";
import { ListItem } from '../ListView';

@Pipe({
    name: 'orderListRow'
})
export class ListViewOrderRow extends OrderByPipe {

    transform(items: ListItem[], orderBy: string, orderListEnable: boolean = false): any {

        if (!orderListEnable || (!items || (!orderBy || orderBy.trim() == ""))) {
            return items;
        }

        //ascending
        return Array.from(items).sort((item1: ListItem, item2: ListItem) => {
            return this.orderByComparator(item1.Data[orderBy], item2.Data[orderBy]);
        });
    }
}