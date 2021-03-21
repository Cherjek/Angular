import { Injectable } from '@angular/core';
import { IFilterContainer } from '../../common/Models/Filters/IFilterContainer';

import { JournalsAddFiltersService } from './JournalsAddFilters.service';
import { JournalsDefFiltersService } from './JournalsDefFilters.service';
import { JournalsFiltersTemplateService } from './JournalsFiltersTemplate.service';

@Injectable()
export class JournalsFilterContainerService implements IFilterContainer {

    constructor(public filtersService: JournalsDefFiltersService,
                public filtersNewService: JournalsAddFiltersService,
                public filtersTemplateService: JournalsFiltersTemplateService) {
    }
}
