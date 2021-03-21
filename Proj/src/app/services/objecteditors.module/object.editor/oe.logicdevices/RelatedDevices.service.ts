import { Injectable } from "@angular/core";
import { WebService } from "../../../common/Data.service";

@Injectable()
export class RelatedDevicesService extends WebService<any> {
    URL: string = "objectcard/logicdevices";

    get(ldId: any) {
        return super.get(`${ldId}/devicesrelated`);
    }
}