import { AppLocalization } from 'src/app/common/LocaleRes';
import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";
import { Observable, Observer } from "rxjs";

import * as DateRangeModule from '../../../common/models/Filter/DateRange';
import DateRange = DateRangeModule.Common.Models.Filter.DateRange;

import { DataResultSettingsService } from '../DataResultSettings.service';

@Injectable()
export class FiltersService extends WebService<any> {
    URL: string = "";

    private tagsFilterValues: any[];
    
    getDefault(): Observable<any> {
        return Observable.create((observer: Observer<any[]>) => {

            let dataResultSettingsService = new DataResultSettingsService();
            let settings = dataResultSettingsService.getSettings();

            let dateRange: DateRange; 
            if (settings && settings.fromDate) {
                dateRange = new DateRange(settings.fromDate, settings.toDate);
                dateRange.Min = settings.fromDate;
                dateRange.Max = settings.toDate;
            }

            let values: any = [];

            if (dateRange) {
                values.push(
                    {
                        IdCategory: 1,
                        Code: "Datetime",
                        FilterType: "DateTime",
                        Name: AppLocalization.Range,
                        SupportedOperationTypes: ["Contains"],
                        SelectedOperationType: "Contains",
                        Value: dateRange
                    }
                );
            }

            if ((this.tagsFilterValues || settings.tags || []).length) {
                values.push(
                    {
                        IdCategory: 1,
                        Code: "TagCode",
                        FilterType: "Array",
                        Name: AppLocalization.Tags,
                        SupportedOperationTypes: ["Contains"],
                        SelectedOperationType: "Contains",
                        Value: (this.tagsFilterValues || settings.tags || []).map((tag: any) => ({
                            Id: tag.Code,
                            Name: tag.Code + '&nbsp' + '<span class="text-info-additional">' + tag.Name + '</span>'
                        }))
                    }
                );
            }
            observer.next(values);
            observer.complete();
        });
    }

    upload(filters: any): Promise<Object> {
        return new Promise((resolve, reject) => {

            resolve(filters);
        });
    }

    setTagsFilterValues(vals: any[]) {
        this.tagsFilterValues = vals;
    }
}