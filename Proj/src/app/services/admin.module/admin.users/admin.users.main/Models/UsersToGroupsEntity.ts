import { AdminUser } from "../../Models/AdminUser";
import { AdminUserGroupView } from "../../../admin.groups/Models/AdminUserGroupView";

export class UsersToGroupsEntity {
    constructor(
        public users: AdminUser[],
        public groups: AdminUserGroupView[]) {
    }
}