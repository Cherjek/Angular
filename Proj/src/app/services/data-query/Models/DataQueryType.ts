import { IData, Data } from './Data';

export interface IDataQueryType extends IData {
}

export class DataQueryType extends Data implements IDataQueryType {
}