import { Injectable } from '@angular/core';
import { IFilterContainer } from '../../common/Models/Filters/IFilterContainer';

import { DataQueryAddFiltersService } from './DataQueryAddFilters.service';
import { DataQueryDefFiltersService } from './DataQueryDefFilters.service';

@Injectable()
export class DataQueryFiltersContainerService implements IFilterContainer {

    filtersTemplateService: any;
    constructor(public filtersService: DataQueryDefFiltersService,
                public filtersNewService: DataQueryAddFiltersService) {
    }
}
