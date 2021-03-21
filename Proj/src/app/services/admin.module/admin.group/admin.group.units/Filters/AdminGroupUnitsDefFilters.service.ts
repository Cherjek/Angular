import { Injectable } from "@angular/core";
import { WebService } from "../../../../common/Data.service";
import {Observable, Observer} from "rxjs/index";

@Injectable()
export class AdminGroupUnitsDefFiltersService extends WebService<any> {
    URL: string = "admin/group/units/filters";

    getDefault(): Observable<any> {
        return super.get('default');
    }

    upload: any;
}