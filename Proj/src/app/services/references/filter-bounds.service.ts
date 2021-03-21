import { AppLocalization } from 'src/app/common/LocaleRes';
import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { TagValueFilterBound, TagValueFilterThresholdType } from './models/TagValueFilterBound';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

const thresholdTypes = [
    { Id: 1, Name: AppLocalization.Any },
    { Id: 2, Name: AppLocalization.Absolute },
    { Id: 3, Name: AppLocalization.Percentage }
];
@Injectable({
  providedIn: 'root'
})
export class FilterBoundsService extends WebService<TagValueFilterBound>
  implements IInlineGrid {
  params: any;
  URL = 'configuration/tag-value-filter-bounds';

  read() {
      return this.get(this.params.id)
          .pipe(
              map((data: TagValueFilterBound[]) => 
                  data.map((d: TagValueFilterBound) => {
                      const res = { ...d };
                      const thresholdType = thresholdTypes.find((tt: any) => tt.Id === d.ThresholdType);
                      res.ThresholdType = thresholdType;
                      return res;
                  })
              )
          );
  }

  create(data: TagValueFilterBound) {
      const request = { ...data};
      if (request.IdTagValueFilter == null) {
          request.IdTagValueFilter = this.params.id;
      }
      if (data.ThresholdType != null) {
          const type = data.ThresholdType.Id;
          request.ThresholdType = type as TagValueFilterThresholdType;
      }
      return this.post(request, this.params.id);
  }

  remove(itemId: number) {
    return super.delete(itemId, this.params.id);
  }

  getThresholdTypes() {
      return of(thresholdTypes);
  }
}
