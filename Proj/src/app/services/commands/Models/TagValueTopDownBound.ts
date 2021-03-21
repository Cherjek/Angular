import { ITagValueBaseBound, TagValueBoundType } from './TagValueBaseBound';
export class TagValueTopDownBound implements ITagValueBaseBound {
  constructor() {
    this.Type = TagValueBoundType.TopDownBounds;
  }
  Type: TagValueBoundType;
  TopBound: number;
  BottomBound: number;
  UsePreviewBounds: boolean;
  PreviewTopBound: number;
  PreviewBottomBound: number;
  TopBoundMessage: string;
  BottomBoundMessage: string;
  PreviewTopBoundMessage: string;
  PreviewBottomBoundMessage: string;
  NormalMessage: string;
}