import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";
import { ServiceJobLog } from "../../common/Models/ServiceJobLog";

@Injectable()
export class ReportResultLogsService extends WebService<ServiceJobLog> {
    URL: string = "reports/result/logs";
}