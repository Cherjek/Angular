import { LogicDeviceTagTypes } from './LogicDeviceTagTypes';

export interface ILogicDeviceTagGroups {
  Id: number;
  IdLogicDeviceType: number;
  Name: string;
  OrderNum: number;
  tags?: LogicDeviceTagTypes[];
}

export class LogicDeviceTagGroups implements ILogicDeviceTagGroups {
  Id: number;
  IdLogicDeviceType: number;
  Name: string;
  OrderNum: number;
  tags?: LogicDeviceTagTypes[];
}
