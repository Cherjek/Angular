import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { IDeviceType } from '../../data-query';
import { IInlineGrid } from '../../common/Interfaces/IInlineGrid';

@Injectable()
export class ReferenceDeviceCommandTypesService extends WebService<IDeviceType>
implements IInlineGrid {
  URL = 'reference/device-command-types';
  params: any;

  read() {
    return super.get();
  }

  create(data: IDeviceType) {
    return super.post(data, this.params.id);
  }

  remove(itemId: number) {
    return super.delete(itemId);
  }
}
