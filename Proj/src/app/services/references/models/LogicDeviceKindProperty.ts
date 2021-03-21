import { LogicDeviceKindPropertyType } from './LogicDeviceKindPropertyType';

export interface ILogicDeviceKindProperty {
  Id?: number;
  IdLogicDeviceKind: number;
  PropertyType: LogicDeviceKindPropertyType;
  Value: string;
}

export class LogicDeviceKindProperty implements ILogicDeviceKindProperty {
  Id?: number;
  IdLogicDeviceKind: number;
  PropertyType: LogicDeviceKindPropertyType;
  Value: string;
}
