import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";

@Injectable()
export class LDMapService extends WebService<any> {
    URL: string = "objectsui/logicdevices/coordinate";
}