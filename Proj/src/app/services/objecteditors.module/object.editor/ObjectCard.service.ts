import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";

@Injectable()
export class ObjectCardService extends WebService<any> {
    URL: string = "objectcard";

    getInfo(idUnit: any) {
        return super.get(`info/${idUnit}`);
    }
}