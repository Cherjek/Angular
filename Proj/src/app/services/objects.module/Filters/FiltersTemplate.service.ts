import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";
import { Observable, Observer } from 'rxjs';

@Injectable()
export class FiltersTemplateService extends WebService<any> {
    URL: string = "objectsui/filterstemplate";

    get(params: any): Observable<any[]> {
        let results = super.get(params);
        return Observable.create((observer: Observer<any[]>) => {

            results.subscribe((data: any[]) => {

                let geoFilter = (data || []).find(x => x.Code === "Geo");
                if (geoFilter) geoFilter.IsDefault = true;

                observer.next(data);
                observer.complete();
            });
        });
    }

    create(data: any) {
        return super.post(data, '/create');
    }
}