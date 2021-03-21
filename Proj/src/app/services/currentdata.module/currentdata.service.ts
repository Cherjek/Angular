import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";
import { PageCurrentData } from "./Models/PageCurrentData";
import { Observable } from "rxjs";

export enum TypeEntity {
    Unit = 0,
    LogicDevice = 1,
    Node = 2
}

@Injectable()
export class CurrentDataService extends WebService<any> {
    
    readonly baseURL: string = "currentdata";

    typeEntity: TypeEntity = TypeEntity.Unit;

    getPages(unitId: number) {
        this.URL = this.baseURL;
        return super.get(`${this.typeEntity}/${unitId}/pages`);
    }

    getPage(unitId: number, pageId: number): Observable<string> {
        this.URL = this.baseURL;
        return super.get(`${this.typeEntity}/${unitId}/page/${pageId}/html`);
    }

    print(unitId: number, pageId: number) {
        this.URL = this.baseURL;
        return super.get(`${this.typeEntity}/${unitId}/page/${pageId}/htmlPrint`);
    }

    export(unitId: number, pageId: number) {
        this.URL = `${this.baseURL}/${this.typeEntity}/${unitId}/page/${pageId}/xls`;
        return super.loadBinaryData();
    }
}