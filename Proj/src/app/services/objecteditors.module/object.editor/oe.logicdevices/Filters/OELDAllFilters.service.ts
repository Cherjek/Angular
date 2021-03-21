import { Injectable } from "@angular/core";
import { WebService } from "../../../../common/Data.service";
import { Observable, Observer } from "rxjs";

@Injectable()
export class OELDAllFiltersService extends WebService<any> {
    URL: string = "objectcard/filters/logicdevices";

    Id: number;

    get(params: any): Observable<any> {
        if (params) {
            return super.get(`${this.Id}/${params}`);
        } else {
            return super.get(this.Id);
        }
    }
}