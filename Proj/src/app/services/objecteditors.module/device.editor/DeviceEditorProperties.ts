import { Injectable } from '@angular/core';
import { WebService } from "../../common/Data.service";

import { Observable, Observer } from "rxjs";

@Injectable()
export class DeviceEditorPropertiesService extends WebService<any> {
    readonly URL = "deviceEditor/propertyOption/values";

    getUnitPropertyOptionValues(request: any): Observable<any[]> {
        return Observable.create((observer: Observer<any[]>) => {
            super.post(request)
                .then((guid: string) => {
                    super.get({ guid: guid })
                        .subscribe((results: any[]) => {
                            observer.next(results);
                            observer.complete();
                        })

                })
                .catch((error: any) => {
                    observer.error(error);
                })
        });
    }
}