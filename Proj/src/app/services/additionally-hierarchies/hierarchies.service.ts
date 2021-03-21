import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/index';
import { delay, retry } from 'rxjs/internal/operators';
import { WebService } from '../common/Data.service';
import { Hierarchy } from './Models/Hierarchy';

@Injectable({
  providedIn: 'root',
})
export class HierarchiesService extends WebService<Hierarchy> {
  URL = 'hierarchy';

  get(): Observable<Hierarchy | Hierarchy[]> {
    return super.get();
  }

  deleteHierarchy(hierarchyId: number): void {
    super.delete('delete');
  }
}
