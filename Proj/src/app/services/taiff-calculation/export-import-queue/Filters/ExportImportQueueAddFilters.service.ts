import { Injectable } from '@angular/core';
import { WebService } from '../../../common/Data.service';

@Injectable()
export class ExportImportQueueAddFiltersService extends WebService<any> {
    URL = 'tariff-calc/export-import/filters';

    get(url?: string) {
        const _url = `new`;
        return super.get(url != null ? `${_url}/${url}` : _url);
    }
}
