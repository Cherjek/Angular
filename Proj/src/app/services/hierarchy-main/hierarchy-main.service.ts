import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/index';
import { map, delay } from 'rxjs/operators';
import { WebService } from '../common/Data.service';
import { IHierarchy, Hierarchy, IHierarchyNodeView, HierarchyNodeView } from '../additionally-hierarchies';

@Injectable({
    providedIn: 'root'
})
export class HierarchyMainService extends WebService<IHierarchy> {
    URL = 'hierarchy-main';

    getHierarchies(): Observable<IHierarchy[]> {
        return super.get('hierarchies')
            .pipe(
                map((hierarchies: any[]) => hierarchies.map(hierarchy => Object.assign(new Hierarchy(), hierarchy)))
            );
    }

    getNodes(idHierarchy: number, key?: string): Observable<IHierarchyNodeView[]> {
        let url = `${idHierarchy}/nodes`;
        if (key != null) {
            url += `/${key}`;
        }
        return super.get(url)
            .pipe(
                map((nodes: any[]) => nodes.map(node => Object.assign(new HierarchyNodeView(), node)))
            );
    }
}
