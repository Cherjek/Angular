import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { LogicDeviceKind } from './models/LogicDeviceKinds';

@Injectable()
export class LogicDeviceKindsService extends WebService<LogicDeviceKind> {
  URL = 'reference/logic-device-kinds';
  idLogicDevice: number | string;
  idDeviceKind: number | string;

  get() {
    return super.get(this.idLogicDevice);
  }

  getDeviceKind() {
    return super.get(`${this.idLogicDevice}/${this.idDeviceKind}`);
  }

  deleteDeviceKind(itemId: number) {
    return super.delete(itemId, `${this.idLogicDevice}`);
  }

  postDeviceKind(device: LogicDeviceKind) {
    return super.post(device, `${this.idLogicDevice}`);
  }
}
