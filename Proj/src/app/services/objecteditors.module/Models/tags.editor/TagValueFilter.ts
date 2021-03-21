import { IObject } from './_tagsEditorModels';

export interface ITagValueFilter extends IObject {
  Code: string;
  ValueType: TagValueFilterType;
  ValueUnits: string;
}

export class TagValueFilter implements ITagValueFilter, IObject {
  Id: number;
  Name: string;
  Code: string;
  ValueType: TagValueFilterType;
  ValueUnits: string;
}

export class TagValueFilterType {
  Id: number;
  Name: string;
  Code: string;
}
