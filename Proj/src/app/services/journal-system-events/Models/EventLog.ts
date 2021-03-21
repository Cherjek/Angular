import { EventLogRecord } from './EventLogRecord';
import { EventLogTag } from './EventLogTag';
import { EventLogLogicDevice } from './EventLogLogicDevice';
import { EventLogUser } from './EventLogUser';

export class EventLog {
  Events: EventLogRecord[];
  Tags: EventLogTag[];
  LogicDevices: EventLogLogicDevice[];
  Users: EventLogUser[];
}