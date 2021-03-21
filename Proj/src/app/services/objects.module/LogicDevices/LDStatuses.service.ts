import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";

@Injectable()
export class LDStatusesService extends WebService<any> {
    URL: string = "objectsui/logicdevices/statuses";
}