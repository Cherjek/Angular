import { WebService } from './../../common/Data.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../../taiff-calculation/export-import-queue/Models/Task';

@Injectable()
export class PUExportImportQueueDefFiltersService extends WebService<any> {
  URL = 'commissioning/export-import/filters';

  upload(filter: any): Promise<Object> {
    return super.post(filter, `upload`);
  }

  getDefault(): Observable<any> {
    return of([]);
  }

  getRecords(key?: string): Observable<Task[]> {
    let url = ``;
    if (key != null) {
      url += `/${key}`;
    }
    return super
      .get(url)
      .pipe(
        map((tasks: any[]) =>
          tasks.map((task) => Object.assign(new Task(), task))
        )
      );
  }
}
