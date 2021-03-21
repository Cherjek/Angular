import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { of } from 'rxjs/index';

@Injectable()
export class CommandDataQueryDefFiltersService extends WebService<any> {
  URL = 'commands/filters';

  upload(filter: any): Promise<object> {
    return super.post(filter, 'upload');
  }

  getDefault() {
    return of([]);
  }
}
