import { Injectable } from '@angular/core';
import { WebService } from "../common/Data.service";
import { ServiceJob } from "../common/Models/ServiceJob";

@Injectable()
export class ReportDirItemsService extends WebService<ServiceJob> {
    URL: string = "reports/groups/items";

}