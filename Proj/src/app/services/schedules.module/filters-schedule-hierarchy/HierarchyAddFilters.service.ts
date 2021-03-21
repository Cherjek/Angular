import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class HierarchyAddFiltersService extends WebService<any> {
    URL = 'hierarchy-nodes';

    idHierarchy: number;

    get(url?: string) {
        const _url = `${this.idHierarchy}/filters/new`;
        return super.get(url != null ? `${_url}/${url}` : _url);
    }
}
