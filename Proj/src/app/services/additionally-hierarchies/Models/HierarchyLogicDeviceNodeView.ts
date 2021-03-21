import {
  IHierarchyLogicDeviceView,
  HierarchyLogicDeviceView
} from './HierarchyLogicDeviceView';
import { Node } from './Node';

export interface IHierarchyLogicDeviceNodeView
  extends IHierarchyLogicDeviceView {
  Nodes?: Node[];
}

export class HierarchyLogicDeviceNodeView extends HierarchyLogicDeviceView
  implements IHierarchyLogicDeviceNodeView {
  Nodes?: Node[];
}
