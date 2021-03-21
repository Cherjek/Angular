import { IObject } from './IObject';

export class TagScriptVariableView implements IObject {
    constructor(
        public Id: number,
        public Name: string,
        public IdValueType?: number
    ) {

    }
}