import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { DeviceChannelTypes } from './models/DeviceChannelTypes';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';

@Injectable({
  providedIn: 'root'
})
export class DeviceChannelTypesService extends WebService<DeviceChannelTypes>
  implements IInlineGrid {
  URL = 'reference/device-channel-types';
  params: any;

  read() {
    return super.get();
  }

  create(data: DeviceChannelTypes) {
    return super.post(data);
  }

  remove(itemId: number) {
    return super.delete(itemId);
  }
}
