export interface IHierarchyNodeLogicDevice {
    Id: number;
    DisplayName: string;
    IdUnit: number;
    UnitDisplayName: string;
    UnitAdditionalInfo: string;
}

export class HierarchyNodeLogicDevice implements IHierarchyNodeLogicDevice {
    Id: number;
    DisplayName: string;
    IdUnit: number;
    UnitDisplayName: string;
    UnitAdditionalInfo: string;
}