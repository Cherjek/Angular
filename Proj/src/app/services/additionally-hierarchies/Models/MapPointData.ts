import { MapStateType } from './MapStateType';
import { MapDataStateValue } from './MapDataStateValue';
import { MapSubSystem } from './SubSystem';
import { HierarchyLogicDeviceView, HierarchyNodeView } from '..';

export class MapPointData {
  coords: number[];
  node: HierarchyNodeView;
  text: string;
  value: string;
  extra: HierarchyLogicDeviceView[];
  state: MapDataStateValueExtra[];
}

export class MapDataStateValueExtra extends MapDataStateValue {
  subSystem: MapSubSystem;
  stateType: MapStateType;
}
