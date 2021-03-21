import { IValueType } from '../../common/Models/ValueType';

export interface IParameter {
  Value: string;
  Id: number;
  IdLogicDeviceCommandType: number;
  Code: string;
  Name: string;
  ValueType?: IValueType;
  MinimumValue: number;
  MaximumValue: number;
  Options: any[];
}
export class Parameter implements IParameter {
  Value: string;
  Id: number;
  IdLogicDeviceCommandType: number;
  Code: string;
  Name: string;
  ValueType?: IValueType;
  MinimumValue: number;
  MaximumValue: number;
  Options: any[];
}
