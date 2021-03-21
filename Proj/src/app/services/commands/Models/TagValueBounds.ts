import { ITagValueBaseBound } from './TagValueBaseBound';

export interface ITagValueBound {
  Id: number;
  Name: string;
  GenerateMissedEvents: boolean;
  Bounds: ITagValueBaseBound;
}

export class TagValueBound implements ITagValueBound {
  Id: number;
  Name: string;
  GenerateMissedEvents: boolean;
  Bounds: ITagValueBaseBound;
}
