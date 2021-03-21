import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";
import { ServiceJob } from "../../common/Models/ServiceJob";

@Injectable()
export class ReportResultDataService extends WebService<ServiceJob> {
    URL: string = "reports/result/data";

}