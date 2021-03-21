import { EntityViewProperty } from '../../common/Models/EntityViewProperty';

export class HierarchyNodeEdit {
    Id: number;
    IdHierarchy: number;
    Properties: EntityViewProperty[];
    PropertyCategories: PropertyCategory[];
}

export class PropertyCategory {
    Code: string;
    Name: string;
    Properties: EntityViewProperty[];
}