/*
 * Справочник параметров, для выпадающего списка
 */
import { IObject } from './IObject';

export class LogicTagTypeView implements IObject {
    Id: number;
    Name: string;
    Code?: string;
    IdValueType?: number;
    ValueName?: string;
    IdLogicTagType?: number;
}