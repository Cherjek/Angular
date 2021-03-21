import { IData, Data } from '../../data-query';
import { IHierarchyNodeView } from '../../additionally-hierarchies/Models/HierarchyNodeView';

export interface IScheduleHierarchyNodes {
    Hierarchy: IData;
    Nodes: IHierarchyNodeView[];
}