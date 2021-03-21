import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { IHierarchyNodeView } from '../../additionally-hierarchies';

@Injectable()
export class RequestResultEquipmentsService extends WebService<IHierarchyNodeView> {
  URL = 'dataquery/result/';

  getData(resultId: any) {
    return super.get(`${resultId}/logic-devices`);
  }
}
