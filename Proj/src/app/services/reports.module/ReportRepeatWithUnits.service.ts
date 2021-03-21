import { Injectable } from '@angular/core';
import { WebService } from "../common/Data.service";

@Injectable()
export class ReportRepeatWithUnitsService extends WebService<any> {
    URL: string = "reports/recreate";
}
