import { EventLogLogicDevice } from './EventLogLogicDevice';
import { EventLogTag } from './EventLogTag';
import { EventLogUser } from './EventLogUser';

export class EventLogRecord {
  Id: any;
  IdLogicDevice: number | EventLogLogicDevice;
  IdTag: number | EventLogTag;  
  IdUserAcknowledge: number | EventLogUser;
  IdSubSystem: number;
  IdStateType: number;
  Datetime: string | Date;
  EventDatetime: string | Date;
  EventMessage: string;
  Acknowledged: boolean | string;
  AcknowledgeDatetime: string | Date;
}
