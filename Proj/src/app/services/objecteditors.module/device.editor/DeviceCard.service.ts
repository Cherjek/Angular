import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";

@Injectable()
export class DeviceCardService extends WebService<any> {
    URL: string = "deviceCard";

    getInfo(idUnit: any) {
        return super.get(`info/${idUnit}`);
    }
}