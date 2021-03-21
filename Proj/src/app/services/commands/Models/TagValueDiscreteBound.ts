import { ITagValueBaseBound, TagValueBoundType } from './TagValueBaseBound';
export class TagValueDiscreteBound implements ITagValueBaseBound {
  constructor() {
    this.Type = TagValueBoundType.Discrete;
  }
  Type: TagValueBoundType;
  NormalState: boolean;
  NormalMessage: string;
  AlertMessage: string;
}