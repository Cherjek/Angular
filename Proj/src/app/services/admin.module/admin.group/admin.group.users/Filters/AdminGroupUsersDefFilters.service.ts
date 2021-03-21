import { AppLocalization } from 'src/app/common/LocaleRes';
import { Injectable } from "@angular/core";
import { WebService } from "../../../../common/Data.service";
import {Observable, Observer} from "rxjs/index";
import * as CommonConstant from "../../../../../common/Constants";

const longStatuses = CommonConstant.Common.Constants.ADMIN_MODULE.statuses_names;
const authTypes = CommonConstant.Common.Constants.ADMIN_MODULE.auth_types;

@Injectable()
export class AdminGroupUsersDefFiltersService extends WebService<any> {
    URL: string = "";

    getDefault(): Observable<any> {
        return Observable.create((observer: Observer<any[]>) => {
            let values: any = [];

                values.push(
                    {
                        IdCategory: 1,
                        Code: "Status",
                        FilterType: "Array",
                        Name: AppLocalization.Activity,
                        SupportedOperationTypes: ["Contains"],
                        SelectedOperationType: "Contains",
                        // IsValuesSingle: true,
                        Value: [ { Name: longStatuses.active }, { Name: longStatuses.notActive }]
                    },
                    {
                        IdCategory: 1,
                        Code: "IdAuthenticityType",
                        FilterType: "Array",
                        Name: AppLocalization.TypeOfAuthorization,
                        SupportedOperationTypes: ["Contains"],
                        SelectedOperationType: "Contains",
                        // IsValuesSingle: true,
                        Value: [ { Name: authTypes.authType1 }, { Name: authTypes.authType2 }]
                    }
                );
                observer.next(values);
                observer.complete();
        });
    }

    upload(filters: any): Promise<Object> {
        return new Promise((resolve, reject) => {

            resolve(filters);
        });
    }
}