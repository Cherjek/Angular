import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { DevicePropertyTypes } from './models/DevicePropertyTypes';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';

@Injectable({ providedIn: 'root' })
export class DevicePropertyTypesService extends WebService<DevicePropertyTypes>
  implements IInlineGrid {
  URL = 'reference/device-property-types';
  params: any;

  read() {
    return super.get();
  }

  create(data: DevicePropertyTypes) {
    return super.post(data);
  }

  remove(itemId: number) {
    return super.delete(itemId);
  }
}
