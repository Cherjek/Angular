import { EntityView } from "./EntityView";

export class DeviceView extends EntityView {
    constructor(public ParentDevice: ParentDeviceView) {
        super();
    }
}

export class ParentDeviceView {
    constructor(
        public Id: number,
        public Name: string,
        public ParentDevice: ParentDeviceView) { }
}