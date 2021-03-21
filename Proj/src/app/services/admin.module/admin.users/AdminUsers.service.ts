import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";
import { Observable } from "rxjs/index";
import { AdminUser } from "./Models/AdminUser";

@Injectable()
export class AdminUsersService extends WebService<any> {
    URL: string = "admin/users";

    getUsers(filterKey?: any): Observable<AdminUser[]> {
        // ea78bf2d-1759-4df7-b4e3-81cb4e8b48ff
        // ea78bf2d-1759-4df7-b4e3-81cb4e8b48ff
        return super.get(filterKey);
    }

    deleteUsers() {

    }
}