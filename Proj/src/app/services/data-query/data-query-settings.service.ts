import { IInlineGrid } from './../common/Interfaces/IInlineGrid';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/index';
import { delay, map } from 'rxjs/operators';
import { WebService } from '../common/Data.service';
import { IDeviceType } from './Models/DeviceType';
import { IDataQueryTypeChannelsView } from './Models/DataQueryTypeChannelsView';
import { IDeviceTagType } from './Models/DeviceTagType';

@Injectable({
    providedIn: 'root'
})
export class DataQuerySettingsService extends WebService<IDeviceType | IDataQueryTypeChannelsView | IDeviceTagType> implements IInlineGrid {
    params: any;
    URL = 'dataquery/settings';
    
    getDeviceTypes(): Observable<IDeviceType[]> {
        return super.get('device-types') as Observable<IDeviceType[]>;
    }

    getDeviceType(idDeviceType: number): Observable<IDeviceType> {
        return super.get(`device-type/${idDeviceType}`) as Observable<IDeviceType>;
    }

    getDeviceTypeDataQueryTypes(idDeviceType: number): Observable<IDataQueryTypeChannelsView[]> {
        return super.get(`device-type-dataquery/${idDeviceType}`) as Observable<IDataQueryTypeChannelsView[]>;
    }
    setDeviceTypeDataQueryTypes(idDeviceType: number, dataQueryTypeChannels: IDataQueryTypeChannelsView[]) {
        return super.post(dataQueryTypeChannels, `device-type-dataquery/${idDeviceType}`);
    }

    getDeviceTagTypes(idDeviceType: number): Observable<IDeviceTagType[]> {
        return super.get(`device-type-tags/${idDeviceType}`) as Observable<IDeviceTagType[]>;
    }
    saveDeviceTagTypes(idDeviceType: number, deviceTagTypes: IDeviceTagType[]) {
        return super.post(deviceTagTypes, `device-type-tags/${idDeviceType}/save`);
    }

    // unit device services
    getUnitDeviceTypeDataQueryTypes(idDeviceType: number): Observable<IDataQueryTypeChannelsView[]> {
        return super.get(`unit-device-type-dataquery/${idDeviceType}`) as Observable<IDataQueryTypeChannelsView[]>;
    }
    setUnitDeviceTypeDataQueryTypes(idDeviceType: number, dataQueryTypeChannels: IDataQueryTypeChannelsView[]) {
        return super.post(dataQueryTypeChannels, `unit-device-type-dataquery/${idDeviceType}`);
    }

    deleteDeviceTagTypes(idDeviceType: number, deviceTagTypesIds: number[]) {
        return super.post(deviceTagTypesIds as any, `device-type-tags/${idDeviceType}/delete`);
    }

    read() {
        return super.get(`device-type-tags/${this.params.id}`) as Observable<IDeviceTagType[]>;
    }

    create(deviceTagTypes: IDeviceTagType) {
        deviceTagTypes.IdDeviceType = this.params.id;
        return super.post([deviceTagTypes], `device-type-tags/${this.params.id}/save`);
    }

    remove(deviceTagTypesIds: any) {
        deviceTagTypesIds = Array.isArray(deviceTagTypesIds) ? deviceTagTypesIds : [deviceTagTypesIds];
        return super.post(deviceTagTypesIds as any, `device-type-tags/${this.params.id}/delete`);
    }

    update(deviceTagTypes: IDeviceTagType) {
        deviceTagTypes.IdDeviceType = this.params.id;
        return super.post([deviceTagTypes], `device-type-tags/${this.params.id}/save`);
    }
}
