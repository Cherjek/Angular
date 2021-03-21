import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { Observable } from 'rxjs';

@Injectable()
export class SubscribersMainService extends WebService<any> {
  URL = 'personal-account/customer-filters';

  getSubscribers(key?: string): Observable<any[]> {
    return super.get(key != null ? key : '') as Observable<any[]>;
  }
}
