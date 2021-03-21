export interface ITagValueFilterBound {
  Id: number;
  IdTagValueFilter: number;
  TimestampThresholdIsActive: boolean;
  TimestampThresholdSeconds: number;
  LowerBoundIsActive: boolean;
  LowerBound: number;
  UpperBoundIsActive: boolean;
  UpperBound: number;
  ThresholdType: TagValueFilterThresholdType;
  AbsoluteThreshold: number;
  PercentThreshold: number;
}

export class TagValueFilterBound implements ITagValueFilterBound {
  Id: number;
  IdTagValueFilter: number;
  TimestampThresholdIsActive: boolean;
  TimestampThresholdSeconds: number;
  LowerBoundIsActive: boolean;
  LowerBound: number;
  UpperBoundIsActive: boolean;
  UpperBound: number;
  ThresholdType: TagValueFilterThresholdType | any;
  AbsoluteThreshold: number;
  PercentThreshold: number;
}

export enum TagValueFilterThresholdType {
  AnyChange = 1,
  Absolute = 2,
  Percent = 3
}
