import { IData } from '../../configuration/Models/Data';

export class ObjectView {
  Id: number;
  Name: string;
  LogicDevices: IData[];
  Devices: IData[];
}