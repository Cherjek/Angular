import { Injectable } from "@angular/core";
import { WebService } from "../../../common/Data.service";

@Injectable()
export class OELogicDevicesService extends WebService<any> {
    URL: string = "objectcard/logicdevices";
}