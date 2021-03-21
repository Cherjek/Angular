import { AppLocalization } from 'src/app/common/LocaleRes';
import { Injectable } from "@angular/core";
import { WebService } from "../../../../common/Data.service";

import * as DateRangeModule from '../../../../../common/models/Filter/DateRange';
import DateRange = DateRangeModule.Common.Models.Filter.DateRange;

import {Observable, Observer} from "rxjs/index";

@Injectable()
export class AdminGroupUsersAddFiltersService extends WebService<any> {
    
    // private storage = {};
    private filters: any[] = [
        {

            Code: "CreationDate",
            FilterType: "DateTime",
            Name: AppLocalization.Created,
            SupportedOperationTypes: ["Contains"],
            SelectedOperationType: "Contains" ,
            Value: new DateRange(null, null)
        }
    ];

    get(params: any): Observable<any> {
        let results: any;
        if (params == null) {
            results = this.filters;
        }
        // else {
        //     results = this.storage[params];
        // }
        return Observable.create((observer: Observer<any[]>) => {

            observer.next(results);
            observer.complete();
        });
    }

    //index - номер записи в списке всех фильтров, 0 - UnitName/1, 1 - LogicDeviceName/1
    /*setStorageArray(index: number, items: any[]) {

        let key = `${this.filters[index]["Code"]}`;
        this.storage[key] = items;
    }

    uniqueColumnValues: any;*/

    setCreationDateValues(users: any[]) {
        users.forEach((user: any) => {
           // if (!this.uniqueColumnValues['CreationDate']['Value'].FromDate || this.uniqueColumnValues['CreationDate']['Value'].FromDate > user['CreationDate'] ) {
           //     this.uniqueColumnValues['CreationDate']['Value'].FromDate = user['CreationDate'];
            if (!this.filters[0].Value.FromDate || this.filters[0].Value.FromDate > user['CreationDate'] ) {
               this.filters[0].Value.FromDate = user['CreationDate'];
               // this.filters[0].Value.Min = new Date(user['CreationDate']);
               // this.filters[0].Value.Min = user['CreationDate'];
           }

           // if (!this.uniqueColumnValues['CreationDate']['Value'].ToDate || this.uniqueColumnValues['CreationDate']['Value'].ToDate < user['CreationDate'] ) {
           //      this.uniqueColumnValues['CreationDate']['Value'].ToDate = user['CreationDate'];
            if (!this.filters[0].Value.ToDate || this.filters[0].Value.ToDate < user['CreationDate'] ) {
               this.filters[0].Value.ToDate = user['CreationDate'];
               // this.filters[0].Value.Max = new Date(user['CreationDate']);
               // this.filters[0].Value.Max = user['CreationDate'];
           }
        });

        // Как и в DatapresentationResultDataComponent DatapresentationResultDataComponent
        this.filters[0].Value.Min = new Date(this.filters[0].Value.FromDate);
        this.filters[0].Value.Max = new Date(this.filters[0].Value.ToDate);

        // console.log(typeof this.filters[0].Value.FromDate, typeof this.filters[0].Value.ToDate, typeof this.filters[0].Value.Min, typeof this.filters[0].Value.Max);
    }
}