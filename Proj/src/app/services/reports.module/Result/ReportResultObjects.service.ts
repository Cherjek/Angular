import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";
import { ObjectTable } from "../../common/Models/ObjectTable";

@Injectable()
export class ReportResultObjectsService extends WebService<ObjectTable> {
    URL: string = "reports/result/objects";
}