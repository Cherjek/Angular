import { IScriptParameter } from './script-parameter';
import { IScriptResult } from './script-result';

export interface IScriptEditor {
  Id: number;
  Name: string;
  Text: string;
  Parameters?: IScriptParameter[];
  Results?: IScriptResult[];
}

export class ScriptEditor implements IScriptEditor {
  Id: number;
  Name: string;
  Text: string;
  Parameters?: IScriptParameter[];
  Results?: IScriptParameter[];
}
