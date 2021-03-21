import { Injectable } from '@angular/core';
import { Observable, Observer, of, forkJoin } from 'rxjs/index';
import { WebService } from '../common/Data.service';
import { MapSubSystem } from '../additionally-hierarchies/Models/SubSystem';
import { MapStateType } from '../additionally-hierarchies/Models/MapStateType';

@Injectable({
  providedIn: 'root'
})
export class HierarchyMainStatesService extends WebService<any> {
  URL = '';
  subSystems: MapSubSystem[];
  stateType: MapStateType[];

  loadHierarchyDataState(hierarchyId: number, nodes: number[], logicDevices: number[]) {
    return new Observable(sbsGlobal => {
      forkJoin([
        this.getStateType(),
        this.getSubSystems()
      ])
      .subscribe((result: [][]) => {
        this.stateType = result[0];
        this.subSystems = result[1];

        this.post(nodes, `data-states/${hierarchyId}/nodes`)
        .then(nodesStates => {
          this.post(logicDevices, `data-states/logic-devices`)
            .then(logicDevicesStates => {
              sbsGlobal.next({ nodesStates, logicDevicesStates });
              sbsGlobal.complete();
            })
            .catch(err => sbsGlobal.error(err));
        })
        .catch(err => sbsGlobal.error(err));

      }, error => sbsGlobal.error(error));
      
    });
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
}