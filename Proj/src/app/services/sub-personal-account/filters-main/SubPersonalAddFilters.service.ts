import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class SubPersonalAddFiltersService extends WebService<any> {
  URL = 'personal-account/customer-filters/new';

  idHierarchy: number;

  get(url?: string) {
    return super.get(url != null ? `${url}` : '');
  }
}
