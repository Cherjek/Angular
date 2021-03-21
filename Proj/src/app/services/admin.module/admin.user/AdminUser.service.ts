import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";
import {Observable} from "rxjs/index";
import {AdminUser} from "../admin.users/Models/AdminUser";
import {AdminUserProperties} from "./Models/AdminUserProperties";

@Injectable()
export class AdminUserService extends WebService<any> {
    URL: string = "admin/user";

    getUser(userId: number): Observable<AdminUser> {
        return super.get(userId);
    }

    setNewUser(userEntity: AdminUserProperties) {
        return super.post(userEntity);
    }

    deleteUser(userId: number) {
        return super.delete(userId);
    }
}