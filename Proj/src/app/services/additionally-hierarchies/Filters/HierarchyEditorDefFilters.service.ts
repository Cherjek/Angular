import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import {Observable, Observer} from 'rxjs/index';

@Injectable()
export class HierarchyEditorDefFiltersService extends WebService<any> {
    URL = 'hierarchy-editor/logic-devices/filters';

    upload: any;

    getDefault(): Observable<any> {
        return super.get('default');
    }
}
