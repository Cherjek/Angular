import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class CommandDataQueryAddFiltersService extends WebService<any> {
  URL = 'commands/filters/new';

  get(url?: string) {
    return super.get(url);
  }
}
