import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class HierarchyFiltersTemplateService extends WebService<any> {
    URL = 'hierarchies';

    idHierarchy: number;

    get(params: any): Observable<any[]> {
        let _url = `${this.idHierarchy}/nodes/filters/templates`;
        if (params != null) {
            _url += `/${params}`;
        }
        return super.get(_url);
    }

    create(data: any) {
        return super.post(data, `${this.idHierarchy}/nodes/filters/templates`);
    }

    delete(params: any) {
        return super.delete(`${this.idHierarchy}/nodes/filters/templates/${params}`);
    }
}
