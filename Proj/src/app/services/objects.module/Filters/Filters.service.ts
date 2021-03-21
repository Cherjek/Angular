import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";
import { Observable } from "rxjs";

@Injectable()
export class FiltersService extends WebService<any> {
    URL: string = "objectsui/filters";

    getDefault(): Observable<any> {
        return super.get('default');
    }

    upload(filters: any): Promise<Object> {
        return super.post(filters, "upload");
    }
}