import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class JournalsFiltersTemplateService extends WebService<any> {
    URL = 'journals/events';

    get(params: any): Observable<any[]> {
        let _url = `templates`;
        if (params != null) {
            _url += `/${params}`;
        }
        return super.get(_url);
    }

    create(data: any) {
        return super.post(data, `templates`);
    }

    delete(params: any) {
        return super.delete(`templates/${params}`);
    }
}
