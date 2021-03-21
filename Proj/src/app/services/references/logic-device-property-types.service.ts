import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { LogicDevicePropertyTypes } from './models/LogicDevicePropertyTypes';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';

@Injectable({
  providedIn: 'root'
})
export class LogicDevicePropertyTypesService
  extends WebService<LogicDevicePropertyTypes>
  implements IInlineGrid {
  URL = 'reference/logic-device-property-types';
  params: any;
  read() {
    return super.get();
  }

  create(data: LogicDevicePropertyTypes) {
    return super.post(data);
  }

  remove(itemId: number) {
    return super.delete(itemId);
  }
}
