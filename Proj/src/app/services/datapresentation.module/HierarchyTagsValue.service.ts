import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";
import { ObjectTagsValueTable } from "./Models/ObjectTagsValueTable";

import { Observable, Observer } from "rxjs";

@Injectable()
export class HierarchyTagsValueService extends WebService<ObjectTagsValueTable> {
    
    idHierarchy: number;
    settingsResultGuid: any;

    get(request: any): Observable<any> {
        this.URL = `datapresentation/hierarchy/${this.idHierarchy}/objecttagstable/tags/values`;

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