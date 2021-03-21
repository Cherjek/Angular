import { FlatNode } from './FlatNode';

export interface IMatTreeActionButtonEmit {
    event: string;
    node: FlatNode;
}

export class MatTreeActionButtonEmit implements IMatTreeActionButtonEmit {
    event: string;
    node: FlatNode;
}