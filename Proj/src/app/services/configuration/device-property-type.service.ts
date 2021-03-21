import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { Observable } from 'rxjs';
import { IDevicePropertyType } from './Models/DevicePropertyType';

@Injectable()
export class DevicePropertyTypeService extends WebService<IDevicePropertyType> {
    URL = 'reference/device-type-properties';

    deviceTypeId: number;

    getDeviceTypePropertyTypes() {
        return super.get(`${this.deviceTypeId}`) as Observable<IDevicePropertyType[]>;
    }

    attachDeviceTypePropertyTypes(devicePropertyTypes: IDevicePropertyType[]) {
        return super.post(devicePropertyTypes, `${this.deviceTypeId}/attach`);
    }

    detachDeviceTypePropertyTypes(devicePropertyTypes: IDevicePropertyType[]) {
        return super.post(devicePropertyTypes, `${this.deviceTypeId}/detach`);
    }
}
