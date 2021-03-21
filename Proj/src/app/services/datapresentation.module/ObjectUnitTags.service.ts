import { Injectable } from '@angular/core';
import { WebService } from "../common/Data.service";
import { Observable, Observer } from 'rxjs';

@Injectable()
export class ObjectUnitTagsService extends WebService<any> { 
    dataPresentService() {
        this.URL = "datapresentation/objecttagstable/tags";
        this.get = (request: any): Observable<any> => {

            return Observable.create((observer: Observer<any[]>) => {
                super.post(request, "cache")
                    .then((guid: string) => {

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
        return this;
    }
    hierarchyDataPresentService(idHierarchy: number) {
        this.URL = 'datapresentation/objecttagstable/tags';
        this.get = (request: any): Observable<any> => {

            return Observable.create((observer: Observer<any[]>) => {
                super.post(request, "cache")
                    .then((guid: string) => {
                        this.URL = `datapresentation/hierarchy/${idHierarchy}/objecttagstable/tags`;
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
        return this;
    }
    objectUnitTagsService() {
        this.URL = "common/equipment/objecttagstable/cache";
        this.get = super.get;
        return this;
    }
}
