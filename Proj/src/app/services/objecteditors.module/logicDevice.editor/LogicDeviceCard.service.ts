import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";

@Injectable()
export class LogicDeviceCardService extends WebService<any> {
    URL: string = "logicDeviceCard";

    getInfo(idLogicDevice: any) {
        return super.get(`info/${idLogicDevice}`);
    }
}