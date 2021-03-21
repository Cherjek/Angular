import { IUserGroup } from '../../admin.module/admin.group/Models/UserGroup';

export interface INotificationSettings {
  Id: number | null;
  Name: string;
  Description: string;
  UserGroup: IUserGroup;
  ByEMail: boolean;
  BySms: boolean;
  EMailSubjectPattern: string;
  EMailBodyPattern: string;
  SmsTextPattern: string;
}
export class NotificationSettings implements INotificationSettings {
  Id: number;
  Name: string;
  Description: string;
  UserGroup: IUserGroup;
  ByEMail: boolean;
  BySms: boolean;
  EMailSubjectPattern: string;
  EMailBodyPattern: string;
  SmsTextPattern: string;
}
