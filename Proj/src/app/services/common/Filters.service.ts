import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";
import { IFilterOperation } from "./Models/Filters/IFilterOperation";

import { Observable, Observer } from "rxjs";

@Injectable()
export class FiltersService extends WebService<any> {
    URL: string = "common/filters";

    getOperators(): Observable<IFilterOperation[]> {
        return super.get("filteroperators");
    }

    upload(filter: any): Promise<Object> {
        return super.post(filter, 'upload');
    }
}