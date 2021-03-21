import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebService } from 'src/app/services/common/Data.service';
import { IDatabaseDataQueryTask, IDatabaseTask } from 'src/app/services/data-query';

@Injectable()
export class TariffMainTaskService extends WebService<IDatabaseDataQueryTask | IDatabaseTask> {
  URL = 'tariff-calc/main';
  cache = {};

  getData(resultId: number) {
    return super.get(`tasks/${resultId}`) as Observable<IDatabaseDataQueryTask>;
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

  getImportFiles(files: string[]) {
    let params = new HttpParams();
    for (let file of files) {
      params = params.append('files', file); 
    }
    // TODO: Change file path
    return super.loadBinaryData('tasks/files', params);
  }
}
