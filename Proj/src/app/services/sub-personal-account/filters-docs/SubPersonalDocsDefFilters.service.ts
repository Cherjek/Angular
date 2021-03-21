import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { of } from 'rxjs';

@Injectable()
export class SubPersonalDocsDefFiltersService extends WebService<any> {
  URL = 'personal-account/document-filters';

  upload(filter: any): Promise<Object> {
    return super.post(filter, 'upload');
  }

  getDefault() {
    return of([]);
  }
}
