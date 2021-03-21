import { IData } from '../../configuration/Models/Data';
import { IHierarchyNodeView } from '../../additionally-hierarchies';

export interface INotificationHierarchySchedule {
  Hierarchy: IData;
  Nodes: IHierarchyNodeView[];
}

export class NotificationHierarchySchedule
  implements INotificationHierarchySchedule {
  Hierarchy: IData;
  Nodes: IHierarchyNodeView[];
}
