import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { LogicDeviceTagTypes } from './models/LogicDeviceTagTypes';

@Injectable({
  providedIn: 'root'
})
export class LogicDeviceTagTypesService extends WebService<LogicDeviceTagTypes> {
  
  logicDeviceId: number;
  URL = 'reference/logic-device-tag-types';

  get() {
    return super.get(this.logicDeviceId);
  }

  getLogicTagTypes() {
    return super.get(`${this.logicDeviceId}/logic-tag-types`);
  }

  getGroups() {
    return super.get(`${this.logicDeviceId}/groups`);
  }

  add(items: LogicDeviceTagTypes[]) {
    return super.post(items as any, `${this.logicDeviceId}/add`);
  }

  update(items: LogicDeviceTagTypes[]) {
    return super.post(items as any, `${this.logicDeviceId}/update`);
  }

  delete(items: LogicDeviceTagTypes[]) {
    return super.post(items as any, `${this.logicDeviceId}/delete`);
  }
}
