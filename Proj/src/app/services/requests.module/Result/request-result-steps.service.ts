import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { DatabaseTaskLogRecord } from '../../data-query/Models/DatabaseTaskLogRecord';
import { Observable } from 'rxjs';

@Injectable()
export class RequestResultStepsService extends WebService<DatabaseTaskLogRecord> {
  URL = 'dataquery/result';

  getData(resultId: any) {
    return super.get(`${resultId}/sub-tasks`) as Observable<DatabaseTaskLogRecord[]>;
  }
}
