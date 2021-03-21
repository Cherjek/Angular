import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class JournalsAddFiltersService extends WebService<any> {
    URL = 'journals/events';

    get(url?: string) {
        const _url = `new`;
        return super.get(url != null ? `${_url}/${url}` : _url);
    }
}
