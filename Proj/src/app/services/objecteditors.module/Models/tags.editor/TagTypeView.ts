import { IObject } from './IObject';

export class TagTypeView implements IObject {
    constructor(
        public Id: number,
        public Name: string
        ) {

    }
}