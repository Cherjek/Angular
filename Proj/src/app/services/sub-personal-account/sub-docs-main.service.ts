import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { Observable } from 'rxjs';

@Injectable()
export class SubscribersMainDocsService extends WebService<any> {
  URL = 'personal-account/document-filters';

  getDocuments(key?: string): Observable<any[]> {
    return super.get(key != null ? key : '') as Observable<any[]>;
  }
}
