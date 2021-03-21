import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { DatabaseTaskLogRecord, DatabaseTask } from '../../data-query';

@Injectable()
export class ScheduleResultService extends WebService<DatabaseTaskLogRecord | DatabaseTask> {
  URL = 'schedule';

  getJournalLog(scheduleId: number, journalId: number) {
    return super.get(`${scheduleId}/journal/${journalId}/log`);
  }

  getJournalSteps(scheduleId: number, journalId: number) {
    return super.get(`${scheduleId}/journal/${journalId}/steps`);
  }
}
