import { IData, Data } from '../../data-query';

export interface IScheduleJournalRecord extends IData {
  CreateDate: string;
  StartDate?: string;
  FinishDate?: string;
  State: IData;
  Progress: number;
  UserName: string;
}

export class ScheduleJournalRecord implements IScheduleJournalRecord {
  CreateDate: string;
  StartDate?: string;
  FinishDate?: string;
  State: IData;
  Progress: number;
  UserName: string;
  Id: number;
  Name: string;
  Code: string;
}
