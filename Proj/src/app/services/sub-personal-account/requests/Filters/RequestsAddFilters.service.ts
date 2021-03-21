import { Injectable } from '@angular/core';
import { WebService } from '../../../common/Data.service';

@Injectable()
export class RequestsAddFiltersService extends WebService<any> {
  URL: string = 'personal-account/request-filters/new';
}
