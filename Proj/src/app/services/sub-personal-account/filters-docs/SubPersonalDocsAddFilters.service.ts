import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class SubPersonalDocsAddFiltersService extends WebService<any> {
  URL = 'personal-account/document-filters/new';

  idHierarchy: number;

  get(url?: string) {
    return super.get(url != null ? `${url}` : '');
  }
}
