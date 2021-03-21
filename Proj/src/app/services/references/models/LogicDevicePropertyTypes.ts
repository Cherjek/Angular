import { IData } from '../../data-query';

export interface ILogicDevicePropertyTypes {
  Id: number;
  Name: string;
  Code: string;
  ValueType: IData;
}

export class LogicDevicePropertyTypes implements ILogicDevicePropertyTypes {
  Id: number;
  Name: string;
  Code: string;
  ValueType: IData;
}
