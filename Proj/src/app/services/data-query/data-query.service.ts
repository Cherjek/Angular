import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/index';
import { delay, map } from 'rxjs/operators';
import { WebService } from '../common/Data.service';
import { IData } from './Models/Data';
import { IQueryTypeTags } from './Models/QueryTypeTags';
import { IDataQueryParameters } from './Models/DataQueryParameters';

@Injectable({
    providedIn: 'root'
})
export class DataQueryService extends WebService<IQueryTypeTags | IDataQueryParameters | IData> {

    URL = 'dataquery';

    getDataQueryTypes(key: string) {
        return super.get(`query-type-tags/${key}`) as Observable<IQueryTypeTags[]>;
    }

    setDataQueryTypes(data: IDataQueryParameters) {
        return super.post(data, `query-type-tags`);
    }

    getQueryTemplates() {
        return super.get('query-templates') as Observable<IData[]>;
    }

    getQueryTemplate(idTemplate: number) {
        return super.get(`query-template/${idTemplate}`) as Observable<IDataQueryParameters>;
    }

    createQueryTemplate(templateName: string, data: IDataQueryParameters) {
        return super.post(data, `query-template/${templateName}`);
    }

    deleteQueryTemplate(idTemplate: number) {
        return super.delete(idTemplate, 'query-template');
    }
}
