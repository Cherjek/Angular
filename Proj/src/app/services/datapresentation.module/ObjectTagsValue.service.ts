import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";
import { ObjectTagsValueTable } from "./Models/ObjectTagsValueTable";

import { Observable, Observer } from "rxjs";

@Injectable()
export class ObjectTagsValueService extends WebService<ObjectTagsValueTable> {
    URL: string = "datapresentation/objecttagstable/tags/values";    

    settingsResultGuid: any;

    get(request: any): Observable<any> {

        return Observable.create((observer: Observer<any[]>) => {
            super.post(request, "cache")
                .then((guid: string) => {

                    this.settingsResultGuid = guid;

                    super.get({ guid: guid })
                        .subscribe((results: any) => {
                            observer.next(results);
                            observer.complete();
                        })

                })
                .catch((error: any) => {
                    observer.error(error);
                })

        });        
    }

    getAfterConfirm() {
        return super.get({ guid: this.settingsResultGuid, confirm: 1 });
    }
}