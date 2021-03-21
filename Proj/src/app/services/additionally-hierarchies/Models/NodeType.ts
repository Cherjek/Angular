export interface INodeType {
    Id: number;
    IdHierarchy: number;
    Name: string;
    Code: string;
    NodeName: string;
    NodesName: string;
}

export class NodeType implements INodeType {
    Id: number;
    IdHierarchy: number;
    Name: string;
    Code: string;
    NodeName: string;
    NodesName: string;
    
    Description?: string;
}