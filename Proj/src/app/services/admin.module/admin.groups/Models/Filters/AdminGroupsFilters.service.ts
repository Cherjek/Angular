import { Injectable } from "@angular/core";
import { WebService } from "../../../../common/Data.service";
import { Observable, Observer } from "rxjs";

@Injectable()
export class AdminGroupsFiltersService extends WebService<any> {
    URL: string = "admin/groups/filters";

    getDefault(): Observable<any> {
        return new Observable((observer: Observer<any[]>) => {
            super.get('default').subscribe(filters => {
                // filters[2].IsValuesSingle = true;

                observer.next(filters);
                observer.complete();
            });
        });
    }

    upload: any;
}