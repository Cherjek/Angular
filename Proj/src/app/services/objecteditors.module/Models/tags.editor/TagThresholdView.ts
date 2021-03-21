import { IObject } from './IObject';

export class TagThresholdView implements IObject {
    constructor(
        public Id: number,
        public Name: string,
        public IdLogicTagType?: number,
        public SendAlarmMessage?: boolean,
        public Type?: ThresholdType,
        public Threshold?: any
    ) {

    }
}

enum ThresholdType {
    //
    // Summary:
    //     DiscreteThresholdView
    Discrete = 0,
    //
    // Summary:
    //     TopDownBoundsThresholdView
    TopDownBounds = 1
}