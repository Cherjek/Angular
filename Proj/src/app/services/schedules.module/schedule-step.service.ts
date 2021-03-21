import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IScheduleStep } from './Models/ScheduleStep';
import { ScheduleStepRequest } from './Models/ScheduleStepRequest';
import { Observable } from 'rxjs';
import { IQueryTypeTags, IData } from '../data-query';
import { DateTimeDepthType } from './Models/DateTimeDepthType';
import { map } from 'rxjs/operators';
import { IEMailRecipient } from './Models/EMailRecipient';

@Injectable()
export class ScheduleStepService extends WebService<IScheduleStep | ScheduleStepRequest | IQueryTypeTags | DateTimeDepthType | IEMailRecipient | number> {
  URL = 'schedule';

  getStepTypes() {
    return super.get('step-types');
  }

  getSteps(scheduleId: number) {
    return super.get(`${scheduleId}/steps`);
  }

  deleteStep(scheduleId: number, stepId: number) {
    return super.delete(`${scheduleId}/step/${stepId}`);
  }

  arrangeSteps(scheduleId: number[], stepId: number) {
    return super.post(scheduleId, `${stepId}/steps/arrange`);
  }

  /**
   * STEP REQUEST SETTINGS
   */
  getQueryTags(scheduleId: number) {
    return super.get(`${scheduleId}/query-tags`) as Observable<IQueryTypeTags[]>;
  }

  getNewScheduleStep(scheduleId: number, scheduleStepType: number) {
    return super.get(`${scheduleId}/step/new/schedule-step-type/${scheduleStepType}`) as Observable<ScheduleStepRequest>;
  }

  getScheduleStep(scheduleId: number, stepId: number) {
    return super.get(`${scheduleId}/step/${stepId}`) as Observable<ScheduleStepRequest>;
  }

  getDatetimeDepthTypes() {
    return super.get('datetime-depth-types') as Observable<DateTimeDepthType[]>;
  }

  setScheduleStep(scheduleId: number, scheduleStepRequest: ScheduleStepRequest) {
    return super.post(scheduleStepRequest, `${scheduleId}/step`);
  }

  getReportTypes() {
    return super.get('report-types') as Observable<IData[]>;
  }

  getEmailRecipients() {
    return super.get('email-recipients') as Observable<IEMailRecipient[]>;
  }
}
