import { DevicesParameters } from './DevicesParameters';
import { HierarchyParameters } from './HierarchyParameters';
import { LogicDevicesParameters } from './LogicDevicesParameters';
import { ObjectsParameters } from './ObjectsParameters';

export interface BaseTaskParameters {
  Name: string;
  ObjectsParameters?: ObjectsParameters;
  LogicDevicesParameters?: LogicDevicesParameters;
  DevicesParameters?: DevicesParameters;
  HierarchiesParameters?: HierarchyParameters[];
}
