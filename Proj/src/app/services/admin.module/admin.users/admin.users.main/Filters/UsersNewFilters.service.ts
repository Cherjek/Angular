import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {WebService} from "../../../../common/Data.service";

@Injectable()
export class UsersNewFiltersService extends WebService<any> {
    URL: string = "admin/users/filters/new";

    /*get() {
        return super.get('Geo/1');
    }*/
}