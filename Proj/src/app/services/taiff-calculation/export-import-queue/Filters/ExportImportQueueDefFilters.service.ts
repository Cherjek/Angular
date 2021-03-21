import { Injectable } from '@angular/core';
import { WebService } from '../../../common/Data.service';
import { Observable, Observer, of, forkJoin } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { Task } from '../Models/Task';

@Injectable()
export class ExportImportQueueDefFiltersService extends WebService<any> {
    URL = 'tariff-calc/export-import/filters';
    
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
        return super.get(url)
            .pipe(
                map((tasks: any[]) => tasks.map(task => Object.assign(new Task(), task)))
            );
    }
}
