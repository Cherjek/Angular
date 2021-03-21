import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { IDatabaseDataQueryTask } from '../../data-query/Models/DatabaseDataQueryTask';
import { IDatabaseTask } from '../../data-query/Models/DatabaseTask';
import { Observable } from 'rxjs';

@Injectable()
export class RequestResultService extends WebService<IDatabaseDataQueryTask | IDatabaseTask> {
  URL = 'dataquery/result';
  cache = {};

  getData(resultId: number) {
    return super.get(`task/${resultId}`) as Observable<IDatabaseDataQueryTask>;
  }

  getsubData(resultId: number, taskType: number) {
    return super.get(`sub-task/${resultId}/${taskType}`) as Observable<IDatabaseTask>;
  }

  setCache(key: string | number, data: any) {
    this.cache[key] = data;
  }

  getCache(key: string | number) {
    return this.cache[key];
  }

  getTags(logicDeviceIds: number[]) {
    return super.post(logicDeviceIds as any, 'tags');
  }
}
