import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class SchedulesAddFiltersService extends WebService<any> {
    URL = 'schedules/filters/new';

    idHierarchy: number;

    get(url?: string) {
        return super.get(url != null ? `${url}` : '');
    }
}
