import { ITagView } from './TagView';

export interface IHierarchyLogicDeviceView {
    Id: number;
    DisplayName: string;
    Tags: ITagView[];
}

export class HierarchyLogicDeviceView implements IHierarchyLogicDeviceView {
    Id: number;
    DisplayName: string;
    Tags: ITagView[];

    IdNodeView: number;
    DisplayNameNodeView: string;
}