import { Pipe, PipeTransform } from '@angular/core';
import { ListItem } from 'src/app/controls/ListView/ListView';

@Pipe({
  name: 'sortTreeListData'
})
export class SortTreeListDataPipe implements PipeTransform {
  transform(items: ListItem[], filedSort: string): ListItem[] {
    if ((items || []).length && items.every(x => x.Data[filedSort] != null))
      return items.sort((a: ListItem, b: ListItem) => a.Data[filedSort] - b.Data[filedSort]);
    else return items;
  }
}