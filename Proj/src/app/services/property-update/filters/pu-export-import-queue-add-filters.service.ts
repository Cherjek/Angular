import { WebService } from './../../common/Data.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PUExportImportQueueAddFiltersService extends WebService<any> {
  URL = 'commissioning/export-import/filters';

  get(url?: string) {
    const _url = `new`;
    return super.get(url != null ? `${_url}/${url}` : _url);
  }
}
