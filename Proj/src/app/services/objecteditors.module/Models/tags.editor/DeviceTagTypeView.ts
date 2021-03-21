import { IObject } from './IObject';

export class DeviceTagTypeView implements IObject {
    constructor(
        public Id: number,
        public Name: string,
        public Code?: string,
        public IdValueType?: number
        ) {

    }
}