import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { LogicTagTypes } from './models/LogicTagTypes';
import { TagValueFilter } from '../objecteditors.module/Models/tags.editor/TagValueFilter';

@Injectable()
export class TagValueFilterService extends WebService<TagValueFilter> {
  URL = 'configuration/tag-value-filter/ltt';
  filterId: any;

  get() {
    return super.get(this.filterId);
  }

  post(data: LogicTagTypes[]) {
    return super.post(data, `${this.filterId}/save`);
  }

  delete(items: LogicTagTypes[]) {
    return super.post(items, `${this.filterId}/remove`);
  }
}
