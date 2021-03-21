import { Injectable } from '@angular/core';
import { WebService } from "../../common/Data.service";

@Injectable()
export class ConnectionLDDevicesService extends WebService<any> {
    URL: string = "objectcard/deviceConnect";

    get(idUnit: number) {
        return super.get(idUnit);
    }
}
