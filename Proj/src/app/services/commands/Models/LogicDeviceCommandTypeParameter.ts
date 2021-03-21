import { IData, Data } from '../../data-query';
import { IValueType } from '../../common/Models/ValueType';

export interface ILogicDeviceCommandTypeParameter extends IData {
  IdLogicDeviceCommandType: number;
  ValueType: IValueType;
  MinimumValue?: number;
  MaximumValue?: number;
}

export class LogicDeviceCommandTypeParameter extends Data
  implements ILogicDeviceCommandTypeParameter {
  IdLogicDeviceCommandType: number;
  ValueType: IValueType;
  MinimumValue?: number;
  MaximumValue?: number;
}
