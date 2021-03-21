import { Injectable } from '@angular/core';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';
import { WebService } from '../common/Data.service';
import { SubSystem } from './models/SubSystem';

@Injectable()
export class SubSystemsService extends WebService<SubSystem>
  implements IInlineGrid {
  URL = 'reference/sub-systems';
  params: any;

  read() {
    return this.get();
  }

  create(data: SubSystem) {
    return this.post(data, this.params.id);
  }

  remove(itemId: number) {
    return this.delete(itemId);
  }
}
