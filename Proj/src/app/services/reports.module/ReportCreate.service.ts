import { Injectable } from '@angular/core';
import { WebService } from "../common/Data.service";

@Injectable()
export class ReportCreateService extends WebService<any> {
    URL: string = "reports/create";
}
