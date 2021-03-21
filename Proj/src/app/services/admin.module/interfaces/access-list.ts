export interface AccessList {
    Id: number;
    Name: string;
    Permissions: AccessListPermission[];
}

export interface AccessListPermission {
    Code: string;
    Id: number;
    Name: string;
    UserGroupsCount: number;
}
