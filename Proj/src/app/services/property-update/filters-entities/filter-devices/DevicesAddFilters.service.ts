import { Injectable } from '@angular/core';
import { WebService } from '../../../common/Data.service';

@Injectable()
export class DevicesAddFiltersService extends WebService<any> {
    URL = 'devices-filters';

    get(url?: string) {
        const _url = 'new';
        return super.get(url != null ? `${_url}/${url}` : _url);
    }
}
