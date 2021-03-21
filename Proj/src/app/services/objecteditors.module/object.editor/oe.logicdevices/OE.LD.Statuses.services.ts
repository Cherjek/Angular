import { Injectable } from '@angular/core';

//import { UnitStatusesService } from '../../../services/objects.module/Units/UnitStatuses.service';
import { LDStatusesService } from '../../../objects.module/LogicDevices/LDStatuses.service';

import { WebService } from "../../../common/Data.service";

@Injectable()
export class OELDStatusesService {
    constructor(private ldStService: LDStatusesService ) { }

    getStatuses(): WebService<any> {
        return this.ldStService;
    }
}