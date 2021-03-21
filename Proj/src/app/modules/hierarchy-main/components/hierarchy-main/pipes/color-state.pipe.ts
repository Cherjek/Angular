/*
 * Pipe для цвета элемента иерархии на основе состояния подсистемы.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { HierarchyDataState } from 'src/app/services/hierarchy-main/Models/HierarchyDataState';

type State = { Id: number; Priority: number; Code: string };

@Pipe({
  name: 'colorState',
})
export class ColorStatePipe implements PipeTransform {
  transform(subSystemsStates: HierarchyDataState[], states: State[]): any {
    const resSort = states.sort((a, b) => b.Priority - a.Priority);
    for (let i = 0; i < resSort.length; i++) {
      if (subSystemsStates.some((x) => x.IdStateType === resSort[i].Id)) {
        return this.setSubSystemColor(resSort[i].Priority);
      }
    }
    return 'gray';
  }

  public setSubSystemColor(priorityNum: number) {
    switch (priorityNum) {
      case 0:
        return '#039447'; //green
      case 1:
        return '#ffa742'; //yellow
      case 2:
        return '#DC143C'; // red
      default:
        return 'grey';
    }
  }
}
