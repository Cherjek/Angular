import { IData } from './Data';
import { DatabaseTaskType } from './DatabaseTaskType.enum';

export interface IDatabaseTaskLogRecord {
  Id: number;
  DateTime: string | Date;
  LogLevel: IData;
  Text: string;
  Data: string;
  TaskTypeCode: DatabaseTaskType;
}

export class DatabaseTaskLogRecord implements IDatabaseTaskLogRecord {
  Id: number;
  DateTime: string | Date;
  LogLevel: IData;
  Text: string;
  Data: string;
  TaskTypeCode: DatabaseTaskType;
}
