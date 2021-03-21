export interface IHierarchyPermissionView {
    Id: number;
    Name: string;
    Description: string;
    IsActive: boolean;
}
export class HierarchyPermissionView implements IHierarchyPermissionView {
    Id: number;
    Name: string;
    Description: string;
    IsActive: boolean;
}