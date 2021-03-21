import { Injectable } from '@angular/core';
import {UsersToGroupsEntity} from "./Models/UsersToGroupsEntity";
import {WebService} from "../../../common/Data.service";

@Injectable({
  providedIn: 'root'
})
export class AdminUsersFromGroupsService extends WebService<any> {
    URL: string = "admin/groups/deleteUsersFromGroup";

    deleteUsers(usersToGroups: UsersToGroupsEntity) {
        return super.post(usersToGroups);
    }
}
