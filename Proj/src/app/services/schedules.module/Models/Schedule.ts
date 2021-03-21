import { IData, Data } from '../../data-query';
import { IUserGroup } from '../../admin.module/admin.group/Models/UserGroup';

export interface ISchedule extends IData {
  Hint: string;
  Active: boolean;
  LastStartDate: string | Date;
  NextStartDate: string | Date;
  TriggerTypeName: string;
  UserGroup: IUserGroup;
}

export class Schedule extends Data implements ISchedule {
  LastStartDate: string | Date;
  NextStartDate: string | Date;
  UserGroup: IUserGroup;
  Description: string;
  Hint: string;
  Active: boolean;
  ScheduleTriggerType: Data;
  TriggerTypeName: string;
}
