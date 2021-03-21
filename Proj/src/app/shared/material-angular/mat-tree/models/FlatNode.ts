/** Flat node with expandable and level information */
export interface FlatNode {
    expandable: boolean;
    name: string;
    nodeId: number;
    level: number;
    data: any;
}