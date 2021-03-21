import { Injectable } from "@angular/core";
import { WebService } from "../../../common/Data.service";
import { UsersToGroupsEntity } from "./Models/UsersToGroupsEntity";

@Injectable()
export class AdminUsersToGroupsService extends WebService<any> {
    URL: string = "admin/groups/addUsers";

    addUsers(usersToGroups: UsersToGroupsEntity) {
        return super.post(usersToGroups);
    }
}