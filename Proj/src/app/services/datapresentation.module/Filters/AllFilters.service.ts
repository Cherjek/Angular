import { AppLocalization } from 'src/app/common/LocaleRes';
import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";
import { Observable, Observer } from "rxjs";

@Injectable()
export class AllFiltersService extends WebService<any> {
    
    private storage = {};
    private filters: any[] = [
        {
            "Code": "IdUnit",
            "FilterType": "Array",
            "Name": AppLocalization.ListOfObjects,
            "SupportedOperationTypes": [
                "Contains"
            ],
            "SelectedOperationType": "Contains"
        },
        {
            "Code": "IdLogicDevice",
            "FilterType": "Array",
            "Name": AppLocalization.EquipmentList,
            "SupportedOperationTypes": [
                "Contains"
            ],
            "SelectedOperationType": "Contains"
        },
        /*{
            "Code": "Value",
            "FilterType": "Float",
            "Name": "Значение",
            "SupportedOperationTypes": [
                "Equal",
                "NotEqual",
                "GreaterThan",
                "LessThan",
                "GreaterThanOrEqual",
                "LessThanOrEqual"
            ],
            "SelectedOperationType": "Equal",
            "Value": null
        }*/
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
}