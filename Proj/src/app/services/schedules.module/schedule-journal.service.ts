import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { ScheduleJournalRecord } from './Models/ScheduleJournalRecord';

@Injectable()
export class ScheduleJournalService extends WebService<ScheduleJournalRecord> {
  URL = 'schedule';

  getJournal(id: number) {
    return super.get(`${id}/journal`);
  }
}
