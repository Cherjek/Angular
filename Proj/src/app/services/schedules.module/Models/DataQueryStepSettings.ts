import { IDataQueryTypeTags } from './DataQueryTypeTags';
import { IDataQueryDates } from './DataQueryDates';

export interface IDataQueryStepSettings {
    DateRange: IDataQueryDates;
    DataQueryTypeTags: IDataQueryTypeTags[];
}

export class DataQueryStepSettings implements IDataQueryStepSettings {
    DateRange: IDataQueryDates;    
    DataQueryTypeTags: IDataQueryTypeTags[];
}