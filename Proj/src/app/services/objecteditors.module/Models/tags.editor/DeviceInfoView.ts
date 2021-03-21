import { IObject } from './IObject';

export class DeviceInfoView implements IObject {
    constructor(
        public Id: number,
        public Name: string,
        public IdDeviceType?: number,
        public IdUnit?: number,
        public DisplayName?: string,
        public UnitDisplayName?: string
        ) {

    }
}