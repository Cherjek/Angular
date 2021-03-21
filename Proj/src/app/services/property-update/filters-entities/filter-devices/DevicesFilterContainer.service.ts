import { Injectable } from '@angular/core';
import { IFilterContainer } from '../../../common/Models/Filters/IFilterContainer';

import { DevicesAddFiltersService } from './DevicesAddFilters.service';
import { DevicesDefFiltersService } from './DevicesDefFilters.service';

@Injectable()
export class DevicesFilterContainerService implements IFilterContainer {

    filtersTemplateService: any;
    constructor(public filtersService: DevicesDefFiltersService,
                public filtersNewService: DevicesAddFiltersService) {
    }
}
