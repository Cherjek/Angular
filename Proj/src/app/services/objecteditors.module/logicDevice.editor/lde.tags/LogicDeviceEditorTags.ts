import { Injectable } from '@angular/core';
import { WebService } from "../../../common/Data.service";

import { Observable, Observer } from "rxjs";

@Injectable()
export class LogicDeviceEditorTagsService extends WebService<any> {
    readonly urlDef = "tagsEditor/table";

    getTags(tagId: number): Observable<any> {
        this.URL = this.urlDef;

        return super.get(tagId);
    }

    getTagsWithFilter(tagId: number, ids: string): Observable<any> {
        this.URL = `${this.urlDef}/${tagId}`;

        return super.get({ ids: ids });
    }
}