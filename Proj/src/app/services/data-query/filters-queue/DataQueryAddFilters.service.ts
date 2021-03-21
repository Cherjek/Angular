import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class DataQueryAddFiltersService extends WebService<any> {
    URL = 'dataquery/filters/new';

    get(url?: string) {
        return super.get(url);
    }
}
