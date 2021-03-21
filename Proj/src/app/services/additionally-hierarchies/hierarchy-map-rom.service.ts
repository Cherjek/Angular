import { of } from 'rxjs';
import { WebService } from 'src/app/services/common/Data.service';
import { Injectable } from '@angular/core';
import { HierarchyMapRom } from './Models/HierarchyMapRom';
import { MapSubSystem } from './Models/SubSystem';
import { MapStateType } from './Models/MapStateType';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HierarchyMapRomService extends WebService<HierarchyMapRom | any> {
  URL = '';
  hierarchyId: number;
  private subSystems: MapSubSystem[];
  private stateType: MapStateType[];
  private cache = {};

  getLatLongs(idHierarchyNodes: number[]) {
    const obj = { idHierarchyNodes, propertyCodes: ['Latitude', 'Longitude'] };
    return this.post(obj, `hierarchies/${this.hierarchyId}/map`);
  }

  getDataStates() {
    return this.get(`data-states/${this.hierarchyId}/nodes`);
  }

  getLogicDeviceSubSystems(ids: number[]) {
    return this.post(ids, `data-states/logic-devices`);
  }

  getSubSystems() {
    if (this.subSystems) {
      return of(this.subSystems);
    }
    return this.get(`reference/sub-systems/filtered`);
  }
  getStateType() {
    if (this.stateType) {
      return of(this.stateType);
    }
    return this.get(`reference/state-types`);
  }

  getNodeProperties(nodeId: number) {
    if (this.cache[nodeId]) {
      return of(this.cache[nodeId]);
    }
    return this.get(`hierarchy-editor/node/${nodeId}`).pipe(
      map((x) => {
        this.cache[nodeId] = x;
        return x;
      })
    );
  }
}
