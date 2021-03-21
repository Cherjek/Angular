import { Injectable } from "@angular/core";
import { WebService } from "../../../common/Data.service";

@Injectable()
export class RelatedLogicDevicesService extends WebService<any> {
    URL: string = "objectcard/devices";

    get(deviceId: any) {
        return super.get(`${deviceId}/logicdevicesrelated`);
    }
}