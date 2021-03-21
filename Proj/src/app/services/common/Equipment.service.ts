import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { ObjectTable } from './Models/ObjectTable';
import { IHierarchyNodeView, HierarchyLogicDeviceView } from '../additionally-hierarchies';

import { Observable, Observer } from 'rxjs';

@Injectable()
export class EquipmentService extends WebService<any | IHierarchyNodeView> {
    URL = 'common/equipment/cache';
    map(values: any[]) {
        values.forEach((item) => {
            item = Object.assign({ IsCheck: false }, item);
        });
    }
    complete(observer: any, values: any[]): void {
        // this.map(values);
        observer.next(values);
        observer.complete();
    }
    get(params: any): Observable<ObjectTable[]> {
        const results = super.get(params);
        return Observable.create((observer: Observer<ObjectTable[]>) => {

            results.subscribe((data: any[]) =>
                this.complete(observer, data)
            );
        });
    }
    private getResult(obs: Observable<IHierarchyNodeView[]>): Observable<IHierarchyNodeView[]> {
        return new Observable(subscribe => {
            obs
                .subscribe((data: IHierarchyNodeView[]) => {
                    (data || []).forEach(
                        (node: IHierarchyNodeView) => {
                            node.LogicDevices = node.LogicDevices.map(ld => {
                                    const logicDeviceView = Object.assign(new HierarchyLogicDeviceView(), ld);
                                    logicDeviceView.IdNodeView = node.Id;
                                    logicDeviceView.DisplayNameNodeView = node.DisplayName;
                                    return logicDeviceView;
                                }
                            );
                        }
                    );
                    subscribe.next(data);
                    subscribe.complete();
            }, (error) => subscribe.error(error));
        });
    }
    getForDataValidation(idHierarchy: number, key: string): Observable<IHierarchyNodeView[]> {
        return this.getResult(super.get(`validation/${idHierarchy}/${key}`));
    }
    getForReport(idHierarchy: number, key: string): Observable<IHierarchyNodeView[]> {
        return this.getResult(super.get(`report/${idHierarchy}/${key}`));
    }
    getForDataPresentation(idHierarchy: number, key: string): Observable<IHierarchyNodeView[]> {
        return this.getResult(super.get(`datapresentation/${idHierarchy}/${key}`));
    }
    getForRequestModule(idHierarchy: number, key: string): Observable<IHierarchyNodeView[]> {
        return this.getResult(super.get(`hierarchy/${idHierarchy}/${key}`));
    }
}
