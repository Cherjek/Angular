import { Injectable } from "@angular/core";
import { WebService } from "../../../../common/Data.service";
import { Observable, Observer } from "rxjs";

@Injectable()
export class AdminGroupsFiltersNewService extends WebService<any> {
    URL: string = "admin/groups/filters/new";
}