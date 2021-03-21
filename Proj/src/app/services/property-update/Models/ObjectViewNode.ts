import { IData } from '../../configuration/Models/Data';

export class ObjectViewNode {
  Id: number;
  UniqueId: number;
  Name: string;
  Nodes: ObjectViewNode[];
}