import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import {Observable, Observer, of} from 'rxjs/index';

@Injectable()
export class HierarchyDefFiltersService extends WebService<any> {
    URL = 'hierarchy-nodes';

    idHierarchy: number;

    upload(filter: any): Promise<Object> {
        return super.post(filter, `${this.idHierarchy}/filters/upload`);
    }

    getDefault() {
        return of([]);
    }
}
