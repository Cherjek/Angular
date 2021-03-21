export interface ITagValueBaseBound {
  Type: TagValueBoundType;
}

export enum TagValueBoundType {
  Discrete = 0,
  TopDownBounds = 1,
}
