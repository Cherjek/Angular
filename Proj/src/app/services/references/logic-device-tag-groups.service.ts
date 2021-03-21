import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';
import { LogicDeviceTagGroups } from './models/LogicDeviceTagGroups';

@Injectable({ providedIn: 'root' })
export class LogicDeviceTagGroupsService
  extends WebService<LogicDeviceTagGroups>
  implements IInlineGrid {
  params: any;
  URL = 'reference/logic-device-tag-groups';

  read() {
    return super.get(`${this.params.id}`);
  }

  create(data: LogicDeviceTagGroups) {
    data.IdLogicDeviceType = this.params.id;
    data.OrderNum = 0;
    return super.post(data, this.params.id);
  }

  remove(itemId: number) {
    return super.delete(`${this.params.id}/${itemId}`);
  }
}
