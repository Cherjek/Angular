import { IHierarchyNodeTypePropertyCategory } from './HierarchyNodeTypePropertyCategory';
import { IValueType } from '../../common/Models/ValueType';


export interface IHierarchyNodeTypePropertyType {
    Id: number;
    Category: IHierarchyNodeTypePropertyCategory;
    IdNodeType: number;
    Name: string;
    Code: string;
    ValueType: IValueType;
}

export class HierarchyNodeTypePropertyType implements IHierarchyNodeTypePropertyType {
    Id: number;
    Category: IHierarchyNodeTypePropertyCategory;
    IdNodeType: number;
    Name: string;
    Code: string;
    ValueType: IValueType;
}