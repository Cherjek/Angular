import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/index';
import { map, tap, finalize, delay, retry } from 'rxjs/operators';
import { WebService } from '../common/Data.service';
import { Hierarchy } from './Models/Hierarchy';
import { HierarchyNodeLogicDevice } from './Models/HierarchyNodeLogicDevice';

@Injectable({
    providedIn: 'root',
})
export class HierarchiesLogicDevicesEditorService extends WebService<HierarchyNodeLogicDevice> {
    URL = 'hierarchy-editor/logic-devices';

    getLogicDevices(key?: string): Observable<HierarchyNodeLogicDevice[]> {
        return super.get(key).pipe(
            map((data: any[]) => data.map(d => Object.assign(new HierarchyNodeLogicDevice(), d)))
        );
    }
}
