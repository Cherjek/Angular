import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class HierarchyAddFiltersService extends WebService<any> {
    URL = 'hierarchies';

    idHierarchy: number;

    get(url?: string) {
        const _url = `${this.idHierarchy}/nodes/filters/new`;
        return super.get(url != null ? `${_url}/${url}` : _url);
    }
}
