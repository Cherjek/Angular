import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { DataQueryTypes } from './models/DataQueryTypes';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';

@Injectable({
  providedIn: 'root'
})
export class DataQueryTypesService extends WebService<DataQueryTypes>
  implements IInlineGrid {
  URL = 'reference/data-query-types';
  params: any;

  read() {
    return super.get();
  }

  create(data: DataQueryTypes) {
    return super.post(data, this.params.id);
  }

  remove(itemId: number) {
    return super.delete(itemId);
  }
}
