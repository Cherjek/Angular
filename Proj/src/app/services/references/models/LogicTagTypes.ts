import { IData } from '../../data-query';

export interface ILogicTagTypes {
  Id: number;
  Name: string;
  Code: string;
  ValueType: IData;
  ValueUnits: string;
}

export class LogicTagTypes implements ILogicTagTypes {
  Id: number;
  Name: string;
  Code: string;
  ValueType: IData;
  ValueUnits: string;
}
