/*
 * Pipe для перевода пустого текста в [Без названия]
 */
import { Pipe, PipeTransform } from '@angular/core';
import { HierarchyDataState } from 'src/app/services/hierarchy-main/Models/HierarchyDataState';

type State = { Id: number, Priority: number, Code: string };
type Subsystem = { Id: number, Code: string, Name: string };

@Pipe({
  name: 'valueFromArray'
})
export class ValueFromArrayPipe implements PipeTransform {
  transform(values: any[], id: number, type: number): any {    
    if (id == null)  return null;
    if (type === 1) {
      const sub = (values as Subsystem[]).find(x => x.Id === id);
      if (sub) {
        return sub.Name;
      }
    } else if (type === 2 || type === 3) {
      const state = (values as State[]).find(x => x.Id === id);
      if (state) {
        const color = (state.Priority === 2) ? 'red' :
        (state.Priority === 1) ? 'orange' : (state.Priority === 0) ? 'green' : '';
        return type === 2 ? `<i class="zmdi zmdi-network color-label-${color}"></i>` : `color-label-${color}`;
      }
    }
    return null;
  }
}