export interface ISubSystemPermissionView {
  Id: number;
  Code: string;
  Name: string;
  IsActive: boolean;
}

export class SubSystemPermissionView implements ISubSystemPermissionView {
  Id: number;
  Code: string;
  Name: string;
  IsActive: boolean;
}
