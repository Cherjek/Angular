import { Injectable } from '@angular/core';
import { WebService } from "../../../common/Data.service";

@Injectable()
export class DeviceTypesService extends WebService<any> {
    readonly URL = "deviceEditor/types";

    get() {
        return super.get();
    }
}
