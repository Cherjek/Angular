import { Injectable } from '@angular/core';
import { IFilterContainer } from '../../common/Models/Filters/IFilterContainer';

import { SchedulesAddFiltersService } from './SchedulesAddFilters.service';
import { SchedulesDefFiltersService } from './SchedulesDefFilters.service';

@Injectable()
export class SchedulesFilterContainerService implements IFilterContainer {

    filtersTemplateService: any;
    constructor(
        public filtersService: SchedulesDefFiltersService, 
        public filtersNewService: SchedulesAddFiltersService) {
    }
}
