import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { LogicTagTypes } from './models/LogicTagTypes';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';

@Injectable({
  providedIn: 'root'
})
export class LogicTagTypesService extends WebService<LogicTagTypes>
  implements IInlineGrid {
  URL = 'reference/logic-tag-types';
  params: any;

  read() {
    return super.get();
  }

  create(data: LogicTagTypes) {
    return super.post(data);
  }

  remove(itemId: number) {
    return super.delete(itemId);
  }
}
