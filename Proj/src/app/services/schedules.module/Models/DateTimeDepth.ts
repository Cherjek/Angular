import { IDateTimeDepthType } from './DateTimeDepthType';

export interface IDateTimeDepth {
    Type: IDateTimeDepthType;
    DepthValue: number;
}

export class DateTimeDepth implements IDateTimeDepth {
    Type: IDateTimeDepthType;
    DepthValue: number;
}