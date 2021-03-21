import { IDataQueryType } from './DataQueryType';
import { ILogicDeviceTagTypeInfo } from './LogicDeviceTagTypeInfo';

export interface IQueryTypeTags {
    QueryType: IDataQueryType;
    AllTagCodes: boolean;
    TagCodes: ILogicDeviceTagTypeInfo[];
}