import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterByField'
})
export class FilterByFieldPipe implements PipeTransform {

    transform(items: any[], field: string, value: any, pipeTrigger: any) {

        let filteredItems: any[] = (items || []).filter((item: any) => item[field] == value);
        return filteredItems;
    }

}
