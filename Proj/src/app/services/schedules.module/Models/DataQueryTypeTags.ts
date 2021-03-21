export interface IDataQueryTypeTags {
    QueryType: string;
    AllTagCodes: boolean;
    TagCodes: string[];
}

export class DataQueryTypeTags implements IDataQueryTypeTags {
    QueryType: string;    
    AllTagCodes: boolean;
    TagCodes: string[];
}