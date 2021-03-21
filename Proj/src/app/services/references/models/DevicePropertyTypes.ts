import { IData } from '../../data-query';

export interface IDevicePropertyTypes {
  Id: number;
  Name: string;
  Code: string;
  ValueType: IData;
  BoolTrue: object;
  BoolFalse: object;
  NumberDecimalDigits: number;
}

export class DevicePropertyTypes implements IDevicePropertyTypes {
  Id: number;
  Name: string;
  Code: string;
  ValueType: IData;
  BoolTrue: object;
  BoolFalse: object;
  NumberDecimalDigits: number;
}
