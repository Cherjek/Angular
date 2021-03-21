import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { Observable } from 'rxjs';
import { IManagementSteps } from '../Models/management-steps';

@Injectable()
export class ManagementResultStepsService extends WebService<IManagementSteps> {
  URL = 'commands';

  getData(resultId: any) {
    return super.get(`${resultId}/steps`) as Observable<IManagementSteps[]>;
  }
}
