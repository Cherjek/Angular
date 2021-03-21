import { EntityGroupParameters } from './EntityGroupParameters';

export interface HierarchyParameters extends EntityGroupParameters {
  IdHierarchy: number;
  IdNodes: number[];
}
