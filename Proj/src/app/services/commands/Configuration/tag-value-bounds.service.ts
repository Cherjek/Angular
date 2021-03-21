import { AppLocalization } from 'src/app/common/LocaleRes';
import { WebService } from 'src/app/services/common/Data.service';
import { Injectable } from '@angular/core';
import { TagValueBound } from '../Models/TagValueBounds';
import { of, Observable } from 'rxjs';
import { LogicTagTypes } from '../../references/models/LogicTagTypes';

@Injectable()
export class TagValueBoundsService extends WebService<
  TagValueBound | LogicTagTypes
> {
  URL = 'configuration/tag-value-bounds';
  idTagValueBound: number | string;

  getBoundTypes() {
    return [
      { Id: 1, Name: AppLocalization.Discrete, Value: AppLocalization.Discrete },
      { Id: 2, Name: AppLocalization.BoundaryRange, Value: AppLocalization.BoundaryRange },
    ];
  }

  getTags() {
    return this.get(`${this.idTagValueBound}/logic-tag-types`) as Observable<LogicTagTypes[]>;
  }

  postTags(data: LogicTagTypes[]) {
    return this.post(data, `${this.idTagValueBound}/logic-tag-types`);
  }

  deleteTags(data: LogicTagTypes[]) {
    return this.post(data, `${this.idTagValueBound}/logic-tag-types/delete`);
  }

  getBounds(idLogicTagType: number) {
    return this.get(`${idLogicTagType}/bounds`) as Observable<LogicTagTypes[]>;
  }
}
