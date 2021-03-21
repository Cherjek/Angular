import { AppLocalization } from 'src/app/common/LocaleRes';
import { Injectable } from "@angular/core";
import { WebService } from "../../../../common/Data.service";
import { Observable, Observer } from "rxjs";

// import * as DateRangeModule from '../../../common/models/Filter/DateRange';
// import DateRange = DateRangeModule.Common.Models.Filter.DateRange;

// import { DataResultSettingsService } from '../DataResultSettings.service';

@Injectable()
export class LDETagsFiltersService extends WebService<any> {
    URL: string = "";

    private tagsFilterValues: any[];
    
    getDefault(): Observable<any> {
        return Observable.create((observer: Observer<any[]>) => {
            let values: any = [];

                values.push(
                    {
                        IdCategory: 1,
                        Code: "TagType",
                        FilterType: "Array",
                        Name: AppLocalization.Type,
                        SupportedOperationTypes: ["Contains"],
                        SelectedOperationType: "Contains",
                        Value: this.uniqueColumnValues['TagType']['Value']
                    },
                    {
                        IdCategory: 1,
                        Code: "MeasureChannel",
                        FilterType: "Array",
                        Name: AppLocalization.MeasuringChannel,
                        SupportedOperationTypes: ["Contains"],
                        SelectedOperationType: "Contains",
                        Value: this.uniqueColumnValues['MeasureChannel']['Value']
                    }/*,
                    {
                        IdCategory: 1,
                        Code: "Source",
                        FilterType: "Array",
                        Name: AppLocalization.Source,
                        SupportedOperationTypes: ["Contains"],
                        SelectedOperationType: "Contains",
                        Value: this.uniqueColumnValues['Source']['Value']
                    },
                    {
                        IdCategory: 1,
                        Code: "LogicTagType",
                        FilterType: "Array",
                        Name: AppLocalization.Parameter,
                        SupportedOperationTypes: ["Contains"],
                        SelectedOperationType: "Contains",
                        Value: this.uniqueColumnValues['LogicTagType']['Value']
                    },
                    {
                        IdCategory: 1,
                        Code: "Threshold",
                        FilterType: "Array",
                        Name: AppLocalization.Thresholds,
                        SupportedOperationTypes: ["Contains"],
                        SelectedOperationType: "Contains",
                        Value: this.uniqueColumnValues['Threshold']['Value']
                    }*/
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

    uniqueColumnValues: any;
    setUniqueColumnValues(tags: any[]) {
        let tagsClone: any[] = JSON.parse(JSON.stringify(tags));
        this.uniqueColumnValues = {
            'TagType': {'Value': []},
            'MeasureChannel': {'Value': []}
            // ,
            // 'Source': {'Value': []},
            // 'LogicTagType': {'Value': []},
            // 'Threshold': {'Value': []},
        };
        tagsClone.forEach((tag: any) => {
            Object.keys(tag).filter((key: any) =>
                key == 'TagType' ||
                key == 'MeasureChannel'
                // ||
                // key == 'Source' ||
                // key == 'LogicTagType' ||
                // key == 'Threshold'
            ).forEach((key: any) => {
                if (this.uniqueColumnValues[key]['Value'].find((item: any) => { return item['Id'] == tag[key]['Id'] }) == undefined) {
                    // if (key == 'LogicTagType') {
                    //     tag[key]['Name'] = `<span>${tag[key]['Code']} </span><span class="text-info-additional">${tag[key]['Name']}</span>`;
                    // }
                    this.uniqueColumnValues[key]['Value'].push(tag[key]);
                }
            });
        });
    }
}