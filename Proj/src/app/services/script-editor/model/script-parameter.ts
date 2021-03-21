import { IScriptData } from './script-data';

export interface IScriptParameter extends IScriptData {
  ValueType: IScriptData;
  Value?: any;
  ToValue?: any;
}

export class ScriptParameter implements IScriptParameter {
  ValueType: IScriptData;
  Id: number;
  Name: string;
  Value?: any;
  ToValue?: any;
}
