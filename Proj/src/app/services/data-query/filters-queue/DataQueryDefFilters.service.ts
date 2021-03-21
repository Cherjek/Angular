import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import {Observable, Observer, of} from 'rxjs/index';

@Injectable()
export class DataQueryDefFiltersService extends WebService<any> {
    URL = 'dataquery/filters';

    upload(filter: any): Promise<Object> {
        return super.post(filter, 'upload');
    }

    getDefault() {
        return of([]);
    }
}
