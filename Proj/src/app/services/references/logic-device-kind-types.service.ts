import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { LogicDeviceKind } from './models/LogicDeviceKinds';
import { LogicDeviceKindProperty } from './models/LogicDeviceKindProperty';

@Injectable()
export class LogicDeviceKindService extends WebService<LogicDeviceKind | LogicDeviceKindProperty> {
  URL = 'reference/logic-device-kind';
  logicDeviceId: number;
  logicDeviceKindId: number;

  get() {
    return super.get(`types/${this.logicDeviceId}`);
  }

  getProps() {
    return super.get(`${this.logicDeviceKindId}/properties`);
  }

  postProps(data: LogicDeviceKindProperty[]) {
    return super.post(data, `${this.logicDeviceKindId}/properties`);
  }

  delete() {
    return super.delete(this.logicDeviceKindId);
  }
}
