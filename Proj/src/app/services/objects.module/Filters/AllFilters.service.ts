import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";
import { Observable } from "rxjs";

@Injectable()
export class AllFiltersService extends WebService<any> {
    URL: string = "objectsui/filters/allnewfilter";
}