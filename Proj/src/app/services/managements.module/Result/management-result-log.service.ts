import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { IDatabaseTaskLogRecord } from '../../data-query/Models/DatabaseTaskLogRecord';

@Injectable()
export class ManagementResultLogService extends WebService<IDatabaseTaskLogRecord> {
  URL = 'commands';

  getLog(managementId: number) {
    return super.get(`${managementId}/log`);
  }

  getsubLog(managementId: number, stepsId: number) {
    return super.get(`${managementId}/steps/${stepsId}/log`);
  }
}
