import { IObject } from './IObject';

export class TagScriptView implements IObject {
    constructor(
        public Id: number,
        public Name: string,
        public OutVariables?: any[]
    ) {

    }
}