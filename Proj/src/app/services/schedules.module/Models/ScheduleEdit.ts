import { IData, Data } from '../../data-query';
import { IUserGroup } from '../../admin.module/admin.group/Models/UserGroup';

export interface IScheduleEdit extends IData {
  Description: string;
  UserGroup: IUserGroup;
}

export class ScheduleEdit extends Data implements IScheduleEdit {
    Description: string;
    UserGroup: IUserGroup;
}
