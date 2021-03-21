import { Injectable } from "@angular/core";
import { WebService } from "./Data.service";
import { Dictionary } from '../../services/common/Models/Dictionary';

import { Observable } from "rxjs";

@Injectable()
export class DictionaryService extends WebService<Dictionary> {
    URL: string;

    get(url: string): Observable<Dictionary | Dictionary[]> {
        this.URL = "common/dictionary/" + url;
        return super.get();
    }
}