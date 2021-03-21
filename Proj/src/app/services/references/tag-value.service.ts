import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';
import { TagValueFilter } from './models/TagValueFilter';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagValueService extends WebService<TagValueFilter>
  implements IInlineGrid {
  params: any;
  URL = 'configuration/tag-value-filters';
  read() {
    return super.get();
  }

  create(data: TagValueFilter) {
    return super.post(data, this.params.id);
  }

  remove(itemId: number) {
    return super.delete(itemId);
  }

  getTagValueFilter(idLogicDevice: number): Observable<any> {
    const url = `${idLogicDevice}/filters`;

    return this.get(url);
  }
}
