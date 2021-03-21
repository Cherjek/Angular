import { Injectable } from "@angular/core";
import { WebService } from "../../../common/Data.service";
import {Observable, Observer, of} from "rxjs/index";

@Injectable()
export class RequestsDefFiltersService extends WebService<any> {
  URL: string = 'personal-account/request-filters';

  upload(filter: any): Promise<Object> {
    return super.post(filter, `upload`);
  }

  getDefault(): Observable<any> {
    return of([]);
  }

  getRequests(
    key?: string
  ): Observable<any[]> {
    return super
      .get(key);
  }
}