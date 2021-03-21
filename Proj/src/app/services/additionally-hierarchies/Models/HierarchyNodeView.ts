import { HierarchyLogicDeviceView } from './HierarchyLogicDeviceView';
export interface IHierarchyNodeView {
    Id: number;
    Name: string;
    DisplayName: string;
    LogicDevices: HierarchyLogicDeviceView[];
}

export class HierarchyNodeView implements IHierarchyNodeView {
    Id: number;
    Name: string;
    DisplayName: string;
    LogicDevices: HierarchyLogicDeviceView[];
}