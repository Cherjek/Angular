import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";
import { ServiceJobLog } from "../common/Models/ServiceJobLog";

@Injectable()
export class ValidationResultLogsService extends WebService<ServiceJobLog> {
    URL: string = "validation/result/logs";
}