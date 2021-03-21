import { IData } from './../../data-query/Models/Data';
import { NodeType } from './../../additionally-hierarchies/Models/NodeType';

export interface ISubPersonalAccount {
  Id: number;
  Name: string;
  Code: string;
  Hierarchy: IData;
  Description: string;
  AccountNodeType: NodeType;
  PropertyCategories: any[];
  AccountPropertyType: any;
  CustomerRegistrationEnabled: boolean;
  AccessRequestType: any;
  TypeTags: any[];
}

export class SubPersonalAccount implements ISubPersonalAccount {
  Description: string;
  AccountNodeType: NodeType;
  PropertyCategories: any[];
  AccountPropertyType: any;
  CustomerRegistrationEnabled: boolean;
  AccessRequestType: any;
  Id: number;
  Name: string;
  Code: string;
  Hierarchy: IData;
  TypeTags: any[];
}
