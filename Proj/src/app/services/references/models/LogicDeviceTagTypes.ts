import { LogicTagTypes } from './LogicTagTypes';
import { LogicDeviceTagGroups } from './LogicDeviceTagGroups';

export interface ILogicDeviceTagTypes {
  Id?: number;
  IdLogicDeviceType: number;
  LogicTagType: LogicTagTypes;
  TagGroup: LogicDeviceTagGroups;
  OrderNum: number;
}

export class LogicDeviceTagTypes implements ILogicDeviceTagTypes {
  Id?: number;
  IdLogicDeviceType: number;
  LogicTagType: LogicTagTypes;
  TagGroup: LogicDeviceTagGroups;
  OrderNum: number;
}
