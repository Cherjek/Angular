import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { IDatabaseTaskLogRecord } from '../../data-query/Models/DatabaseTaskLogRecord';

@Injectable()
export class RequestResultLogService extends WebService<IDatabaseTaskLogRecord> {
  URL = 'dataquery/result';

  getLog(resultId: number) {
    return super.get(`task-log/${resultId}`);
  }

  getsubLog(resultId: number, taskType: number) {
    return super.get(`sub-task-log/${resultId}/${taskType}`);
  }
}
