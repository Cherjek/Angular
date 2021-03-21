import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WebService } from '../common/Data.service';
import {
  IHierarchy,
  Hierarchy,
  IHierarchyNodeView,
  HierarchyNodeView,
} from '../additionally-hierarchies';

@Injectable({
  providedIn: 'root',
})
export class PaSubscriberHierarchyService extends WebService<IHierarchy> {
  URL = 'hierarchy-nodes';

  getHierarchies(): Observable<IHierarchy[]> {
    return super
      .get('hierarchies')
      .pipe(
        map((hierarchies: any[]) =>
          hierarchies.map((hierarchy) =>
            Object.assign(new Hierarchy(), hierarchy)
          )
        )
      );
  }

  getNodes(
    idHierarchy: number,
    key?: string
  ): Observable<IHierarchyNodeView[]> {
    let url = `${idHierarchy}/filters`;
    if (key != null) {
      url += `/${key}`;
    }
    return super
      .get(url)
      .pipe(
        map((nodes: any[]) =>
          nodes.map((node) => Object.assign(new HierarchyNodeView(), node))
        )
      );
  }
}
