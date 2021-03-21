import { WebService } from './../common/Data.service';
import { Injectable } from '@angular/core';
import { IScriptEditor } from './model/script-editor';

@Injectable()
export class ScriptEditorService extends WebService<IScriptEditor> {
  URL = 'script-editors';
}
