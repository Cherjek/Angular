import { Injectable } from "@angular/core";
import { WebService } from "../../../../common/Data.service";
import { Observable, Observer } from "rxjs";

@Injectable()
export class OELDFiltersService extends WebService<any> {
    URL: string = "objectcard/filters/logicdevices";

    Id: number;

    getDefault(): Observable<any> {
        return super.get('def/' + this.Id);
    }

    upload(filters: any): Promise<Object> {
        return super.post(filters, "upload");
    }
}