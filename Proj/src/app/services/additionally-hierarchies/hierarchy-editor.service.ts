import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/index';
import { map, tap, finalize, delay, retry } from 'rxjs/internal/operators';
import { WebService } from '../common/Data.service';
import { Hierarchy } from './Models/Hierarchy';
import { IHierarchyNodeLogicDevice, HierarchyNodeLogicDevice } from './Models/HierarchyNodeLogicDevice';
import { HierarchyNodeEdit } from './Models/HierarchyNodeEdit';

@Injectable({
    providedIn: 'root',
})
export class HierarchiesEditorService extends WebService<IHierarchyNodeLogicDevice | HierarchyNodeEdit | number[]> {
    URL = 'hierarchy-editor';

    getLogicDevices(idNode: number): Observable<IHierarchyNodeLogicDevice[]> {
        return super.get(`node/${idNode}/logic-devices`).pipe(
            map((data: any[]) => data.map(d => Object.assign(new HierarchyNodeLogicDevice(), d)))
        );
    }

    getNewNode(idNodeType: number, hierarchyId: number, parentNodeId?: number): Observable<HierarchyNodeEdit> {
        let url = `node/new/${hierarchyId}/${idNodeType}`;
        if (parentNodeId) {
            url += `/${parentNodeId}`;
        }
        return super.get(url).pipe(
            map(data => Object.assign(new HierarchyNodeEdit(), data))
        );
    }

    getNode(idNode: number): Observable<HierarchyNodeEdit> {
        return super.get(`node/${idNode}`).pipe(
            map(data => Object.assign(new HierarchyNodeEdit(), data))
        );
    }

    deleteNode(idNode: number) {
        return super.delete(idNode, 'node');
    }

    postNode(nodeEdit: HierarchyNodeEdit) {
        return super.post(nodeEdit, 'node');
    }

    postLogicDevicesToNode(idsLogicDevice: number[], idNode: number) {
        return super.post(idsLogicDevice, `node/${idNode}/logic-devices`);
    }

    removeLogicDevicesFromNode(idsLogicDevice: number[], idNode: number) {
        return super.post(idsLogicDevice, `node/${idNode}/logic-devices/remove`);
    }

    arrangeLogicDevicesAsync(idsLogicDevice: number[], idNode: number) {
        return super.post(idsLogicDevice, `node/${idNode}/logic-devices/arrange`);
    }

    arrangeNodesAsync(idHierarchy: number, idChildrenNodes: number[], idNode: number) {
        return super.post(idChildrenNodes, `${idHierarchy}/node/${idNode}/nodes/arrange`);
    }
}
