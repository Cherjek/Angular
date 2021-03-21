/*
 * Pipe для перевода пустого текста в [Без названия]
 */
import { Pipe, PipeTransform } from '@angular/core';
import { HierarchyDataState } from 'src/app/services/hierarchy-main/Models/HierarchyDataState';

@Pipe({
  name: 'isDataState'
})
export class IsDataRottenPipe implements PipeTransform {
  transform(subSystemsStates: HierarchyDataState[], field: string, val: any): any {
    return (subSystemsStates || []).some(x => val != null ? x[field] === val : x[field]);
  }
}