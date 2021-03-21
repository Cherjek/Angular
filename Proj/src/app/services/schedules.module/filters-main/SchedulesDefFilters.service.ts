import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { of } from 'rxjs';

@Injectable()
export class SchedulesDefFiltersService extends WebService<any> {
    URL = 'schedules/filters';

    upload(filter: any): Promise<Object> {
        return super.post(filter, 'upload');
    }

    getDefault() {
        return of([]);
    }
}
