import { Injectable } from '@angular/core';

import { WebService } from "../../common/Data.service";

@Injectable()
export class LogicDeviceTypesService extends WebService<any> {
    readonly URL = "logicDeviceEditor/types";

    get() {
        return super.get();
    }
}
