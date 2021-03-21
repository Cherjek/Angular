import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { ServiceJob } from '../common/Models/ServiceJob';

@Injectable()
export class RequestsQueueService extends WebService<ServiceJob> {
  URL = 'dataquery/requests-queue';

  abortTask(id: number) {
    return this.post(null, `${id}`);
  }
}
