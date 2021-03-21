import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/index';
import { map, delay } from 'rxjs/operators';
import { WebService } from '../common/Data.service';
import { Node } from './Models/Node';
@Injectable({
    providedIn: 'root'
})
export class HierarchyCardService extends WebService<Node> {
    URL = 'hierarchy';
    /**
    * получение списка узлов иерархии
    * @param idHierarchy номер иерахии, number
    * @returns Node[]
    */
    getNodeTree(idHierarchy: number): Observable<Node[]> {
        return super.get(`${idHierarchy}/nodes`)
            .pipe(
                map((nodes: any[]) => nodes.map(node => Object.assign(new Node(), node)))
            );
    }

    /**
    * получение списка узлов иерархии
    * @param idHierarchy номер иерахии, number
    * @param idHierarchyNode конкретный узел, number
    * @returns Node[]
    */
    getNodeTreeWithNode(idHierarchy: number, idHierarchyNode: number): Observable<Node[]> {
        return super.get(`${idHierarchy}/nodes/${idHierarchyNode}`)
            .pipe(
                map((nodes: any[]) => nodes.map(node => Object.assign(new Node(), node)))
            );
    }
}
