import { AdminUserGroupView } from "../../admin.groups/Models/AdminUserGroupView";

export class AdminUserProperties {
    constructor(
        public Id: number,
        public IsBlocked: boolean,
        public IdMainUserGroup: number,
        public Login: string,
        public Name: string,
        public PhoneNumber: string,
        public Email: string,
        public Password: string,
        public IdAuthenticityType: string,
        public Comment: string,
        public UserGroups: AdminUserGroupView[],
        public AuthType: string[]
    ) {}
}