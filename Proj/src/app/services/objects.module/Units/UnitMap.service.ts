import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";

@Injectable()
export class UnitMapService extends WebService<any> {
    URL: string = "objectsui/units/coordinate";
}