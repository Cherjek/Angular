import { AppLocalization } from 'src/app/common/LocaleRes';
import { Injectable } from "@angular/core";
import { WebService } from "../../../../common/Data.service";
import { Observable, Observer } from "rxjs";

@Injectable()
export class LDETagsAllFiltersService extends WebService<any> {
    
    private storage = {};
    private filters: any[] = [
        {
            Code: "Source",
            FilterType: "Array",
            Name: AppLocalization.Source,
            SupportedOperationTypes: ["Contains"],
            SelectedOperationType: "Contains"
        },
        {
            Code: "LogicTagType",
            FilterType: "Array",
            Name: AppLocalization.Parameter,
            SupportedOperationTypes: ["Contains"],
            SelectedOperationType: "Contains"
        },
        {
            Code: "Threshold",
            FilterType: "Array",
            Name: AppLocalization.Thresholds,
            SupportedOperationTypes: ["Contains"],
            SelectedOperationType: "Contains"
        }
    ];

    get(params: any): Observable<any> {
        let results: any;
        if (params == null) {            
            results = this.filters;
        }
        else {
            results = this.storage[params];
        }
        return Observable.create((observer: Observer<any[]>) => {

            observer.next(results);
            observer.complete();
        });
    }

    //index - номер записи в списке всех фильтров, 0 - UnitName/1, 1 - LogicDeviceName/1
    setStorageArray(index: number, items: any[]) {

        let key = `${this.filters[index]["Code"]}`;
        this.storage[key] = items;
    }

    getFilter(code: string) {
        return this.filters.find(x => x["Code"] === code);
    }

    uniqueColumnValues: any;
    setUniqueColumnValues(tags: any[]) {
        let tagsClone: any[] = JSON.parse(JSON.stringify(tags));
        this.uniqueColumnValues = {
            // 'TagType': {'Value': []},
            // 'MeasureChannel': {'Value': []},
            'Source': {'Value': []},
            'LogicTagType': {'Value': []},
            'Threshold': {'Value': []},
        };
        tagsClone.forEach((tag: any) => {
            Object.keys(tag).filter((key: any) =>
                // key == 'TagType' ||
                // key == 'MeasureChannel' ||
                key == 'Source' ||
                key == 'LogicTagType' ||
                key == 'Threshold'
            ).forEach((key: any) => {
                if (this.uniqueColumnValues[key]['Value'].find((item: any) => { return item['Id'] == tag[key]['Id'] }) == undefined) {
                    if (key == 'LogicTagType') {
                        tag[key]['Name'] = `<span>${tag[key]['Code']} </span><span class="text-info-additional">${tag[key]['Name']}</span>`;
                    }
                    this.uniqueColumnValues[key]['Value'].push(tag[key]);
                }
            });
        });
    }
}