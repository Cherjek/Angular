import { Injectable } from '@angular/core';
import { WebService } from '../../../common/Data.service';
import {Observable, Observer, of} from 'rxjs/index';
import { HierarchyNodeView, IHierarchyNodeView } from 'src/app/services/additionally-hierarchies';
import { map } from 'rxjs/operators';

@Injectable()
export class DevicesDefFiltersService extends WebService<any> {
    URL = 'devices-filters';

    upload(filter: any): Promise<Object> {
        return super.post(filter, `upload`);
    }

    getDefault() {
        return of([]);
    }

    getDevices(key?: string): Observable<any[]> {
      return super.get(key)
          .pipe(
              map((nodes: any[]) => {
                return nodes.map(node => node.Devices)
                  .reduce((list1, list2) => [...list1, ...list2]);
              })
          );
    }
}
