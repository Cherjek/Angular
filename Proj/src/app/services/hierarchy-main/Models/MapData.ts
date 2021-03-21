import { IHierarchyNodeView } from './../../additionally-hierarchies/Models/HierarchyNodeView';
import { MapSubSystem } from '../../additionally-hierarchies/Models/SubSystem';
import { MapStateType } from '../../additionally-hierarchies/Models/MapStateType';

export class MapData {
    data: IHierarchyNodeView[];
    subSystems: MapSubSystem[];
    stateType: MapStateType[];
}
