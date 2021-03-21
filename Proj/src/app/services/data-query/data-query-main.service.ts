import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/index';
import { delay, map } from 'rxjs/operators';
import { WebService } from '../common/Data.service';
import { IDataQueryType } from './Models/DataQueryType';
import { IDeviceChannelType } from './Models/DeviceChannelType';
import { ITimeStampType } from './Models/TimeStampType';
import { IValueType } from '../common/Models/ValueType';

@Injectable({
    providedIn: 'root'
})
export class DataQueryMainService extends WebService<IDataQueryType | IDeviceChannelType | ITimeStampType | IValueType> {
    URL = 'dataquery/main';

    getDataQueryTypes(): Observable<IDataQueryType[]> {
        return super.get('query-types') as Observable<IDataQueryType[]>;
    }

    getDeviceChannelTypes(): Observable<IDeviceChannelType[]> {
        return super.get('device-channel-types') as Observable<IDeviceChannelType[]>;
    }

    getTimeStampTypes(): Observable<ITimeStampType[]> {
        return super.get('timestamp-types') as Observable<ITimeStampType[]>;
    }

    getValueTypes(): Observable<IValueType[]> {
        return super.get('value-types') as Observable<IValueType[]>;
    }
}
