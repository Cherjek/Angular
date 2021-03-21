import { Injectable } from '@angular/core';
import { IHierarchyNodesView, HierarchyLogicDeviceNodeViewState } from '../hierarchy-main.component';
import { HierarchyDataState } from 'src/app/services/hierarchy-main/Models/HierarchyDataState';

@Injectable({
  providedIn: 'root'
})
export class FilterStateService {
  private findItem = (filter: any, field: string, x: any) => {
    return filter[field].find((y: number | boolean) => {
      if (typeof x[field] === 'boolean') {
        return (y === 1 ? true : false) === x[field];
      }
      else return y === x[field];
    }) != null;
  }
  applyFilter(filter: any, dataResult: IHierarchyNodesView[] | HierarchyLogicDeviceNodeViewState[]) {
    let result = (dataResult as any[]);
    if(result && result.length) {
      if (filter != null && Object.keys(filter).length) {
        const fields = Object.keys(filter);
        result = (dataResult as any[])
        .map((x: IHierarchyNodesView | HierarchyLogicDeviceNodeViewState) => {
          const val = {...x};
          x.SubSystemsStates = (x.SubSystemsStates || []).map((sb: HierarchyDataState) => ({...sb}));
          return val;
        })
        .filter((x: IHierarchyNodesView | HierarchyLogicDeviceNodeViewState) => {
          if (x.SubSystemsStates) {
            let result = true;
            for(let i = 0; i < fields.length; i++) {
              const field = fields[i];
              result = (result && x.SubSystemsStates.some(x => this.findItem(filter, field, x)));
            }       
            x.SubSystemsStates = x.SubSystemsStates.filter(sb => {
              let filterSub = true;
              for(let i = 0; i < fields.length; i++) {
                const field = fields[i];
                filterSub = (filterSub && this.findItem(filter, field, sb));
              }
              return filterSub;
            });
            return result;
          } else {
            return false;
          }
        });
      } 
    }
    return result;
  }
}