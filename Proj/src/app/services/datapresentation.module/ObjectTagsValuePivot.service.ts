/*
 * EXAMPLE RESPONSE:
 * 
 * {
    "Columns": {
        "35": {
            "UniqueId": 670,
            "Value": 1587.721,
            "Datetime": "2015-02-01T00:00:00+03:00",
            "IdLogicDevice": 35,
            "IdUnit": 18,
            "LogicDeviceDisplayText": "Сетевой ввод",
            "UnitDisplayText": "14861, НО-Аврора",
            "TagId": 35,
            "TagCode": "A+0",
            "TagName": "Суммарная активная энергия прямого направления от сброса",
            "TagUnitName": "Вт*ч"
        }
 * 
 * 
 * "Table": {
        "2015-02-01T00:00:00+03:00": {
            "35": 1587.721,
            "37": 22627.931,
            "260": 1.021,
            "Datetime": "2015-02-01T00:00:00+03:00"
        },
        "2015-02-01T00:30:00+03:00": {
            "35": 1587.808,
            "37": 22628.95,
            "260": 0.968,
            "Datetime": "2015-02-01T00:30:00+03:00"
        },
        "2015-02-01T01:00:00+03:00": {
            "35": 1587.895,
            "37": 22629.998,
            "260": 0.977,
            "Datetime": "2015-02-01T01:00:00+03:00"
        },
 * 
 * 
 * 
 * 
 * 
 * 
 */

import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";
import { Observable, Observer } from 'rxjs';

@Injectable()
export class ObjectTagsValuePivotService extends WebService<any> {
    URL: string = "datapresentation/objecttagstable/tags/pivottable";    

    get(request: any): Observable<any> {

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
}