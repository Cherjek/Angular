import { Injectable } from '@angular/core';
import { IFilterContainer } from '../../common/Models/Filters/IFilterContainer';

import { HierarchyAddFiltersService } from './HierarchyAddFilters.service';
import { HierarchyDefFiltersService } from './HierarchyDefFilters.service';
import { HierarchyFiltersTemplateService } from './HierarchyFiltersTemplate.service';

@Injectable()
export class HierarchyFilterContainerService implements IFilterContainer {

    constructor(public filtersService: HierarchyDefFiltersService,
                public filtersNewService: HierarchyAddFiltersService,
                public filtersTemplateService: HierarchyFiltersTemplateService) {
    }

    updateIdHierarchy(idHierarchy: number) {
        this.filtersService.idHierarchy = idHierarchy;
        this.filtersNewService.idHierarchy = idHierarchy;
        this.filtersTemplateService.idHierarchy = idHierarchy;
    }
}
