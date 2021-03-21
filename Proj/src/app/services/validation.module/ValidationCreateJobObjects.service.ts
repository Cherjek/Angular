import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";
import * as Models from './Models/DataValidationCreateJobObject';

import { Observable, Observer } from "rxjs";

import DataValidationCreateJobObject = Models.Services.ValidationModule.Models.DataValidationCreateJobObject;

@Injectable()
export class ValidationCreateJobObjectsService extends WebService<DataValidationCreateJobObject> {
    URL: string = "validation/devices";
    map(values: any[]) {
        if (values) {
            for (let i = 0; i < values.length; i++) {
                values[i].IsCheck = true;
                if (typeof (values[i].Items) !== 'undefined' && values[i].Items.length) {
                    this.map(values[i].Items);
                }
            }
        }
    }
    complete(observer: any, values: any[]): void {
        this.map(values);
        observer.next(values);
        observer.complete();
    }
    load(): Observable<DataValidationCreateJobObject[]> {
        let results = super.get();
        return Observable.create((observer: Observer<DataValidationCreateJobObject[]>) => {

            results.subscribe((data: any[]) =>
                this.complete(observer, data)
            );
        });
    }
}