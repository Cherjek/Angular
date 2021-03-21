import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { Observable } from 'rxjs';
import { IManagementParams } from '../Models/management-params';

@Injectable()
export class ManagementResultService extends WebService<IManagementParams> {
  URL = 'commands';
  cache = {};

  getData(resultId: number) {
    return super.get(`${resultId}`) as Observable<IManagementParams>;
  }

  getsubData(managementId: number, stepsId: number) {
    return super.get(`${managementId}/steps/${stepsId}`) as Observable<IManagementParams>;
  }

  setCache(key: string | number, data: any) {
    this.cache[key] = data;
  }

  getCache(key: string | number) {
    return this.cache[key];
  }

  abortCommand(managementId: number) {
    return super.post(null, `${managementId}/abort`);
  }
}
