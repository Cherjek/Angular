﻿import { Injectable } from '@angular/core';
import { WebService } from '../../../common/Data.service';
import {Observable, Observer, of} from 'rxjs/index';
import { HierarchyNodeView, IHierarchyNodeView } from 'src/app/services/additionally-hierarchies';
import { map } from 'rxjs/operators';

@Injectable()
export class HierarchyDefFiltersService extends WebService<any> {
    URL = 'hierarchies';

    idHierarchy: number;

    upload(filter: any): Promise<Object> {
        return super.post(filter, `${this.idHierarchy}/nodes/filters/upload`);
    }

    getDefault() {
        return of([]);
    }

    getNodes(idHierarchy: number, key?: string): Observable<IHierarchyNodeView[]> {
      let url = `${idHierarchy}/nodes/filters/ex`;
      if (key != null) {
          url += `/${key}`;
      }
      return super.get(url)
          .pipe(
              map((nodes: any[]) => nodes.map(node => Object.assign(new HierarchyNodeView(), node)))
          );
    }
}
