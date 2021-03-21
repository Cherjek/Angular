import { Injectable } from '@angular/core';
import {WebService} from '../common/Data.service';
import { Observable } from 'rxjs/index';
import { TagCommonTable } from './index'

@Injectable({
  providedIn: 'root'
})
export class PersonalAccountService extends WebService<any> {
    URL: string = "profile/indication";

    getData(): Observable<any> {
        return super.get();
    }

    getLDPeriodTypes(ldId: number): Observable<any> {
        return super.get(`timestamp/${ldId}`);
    }

    getTagsValue(request: any): Promise<any> {
        return super.post(request, 'table');
    }

    getCommonTagsValue(unitId: number): Observable<TagCommonTable[]> {
        return super.get(`tableCommon/${unitId}`);
    }
}
