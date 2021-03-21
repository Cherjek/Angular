import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { ServiceJob } from '../common/Models/ServiceJob';

@Injectable()
export class RequestsQueueFiltersService extends WebService<ServiceJob> {
  URL = 'dataquery/filters';
}
