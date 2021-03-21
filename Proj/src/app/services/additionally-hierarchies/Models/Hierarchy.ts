export interface IHierarchy {
    Id: number | undefined;
    Name: string | undefined;
    Description: string | undefined;
    NodesName: string | undefined;
    IsPersonal: boolean | undefined;
    AllowDuplicateLogicDevice: boolean | undefined;
}
export class Hierarchy implements IHierarchy {
    Id: number | undefined;
    Name: string | undefined;
    Description: string | undefined;
    NodesName: string | undefined;
    IsPersonal: boolean | undefined;
    AllowDuplicateLogicDevice: boolean | undefined;
}