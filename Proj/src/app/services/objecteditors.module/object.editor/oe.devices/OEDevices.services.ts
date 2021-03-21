import { Injectable } from "@angular/core";
import { WebService } from "../../../common/Data.service";

@Injectable()
export class OEDevicesService extends WebService<any> {
    URL: string = "objectcard/devices";
}