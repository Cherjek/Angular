import { Injectable } from '@angular/core';
import { IFilterContainer } from '../../../common/Models/Filters/IFilterContainer';

import { HierarchyAddFiltersService } from './HierarchyAddFilters.service';
import { HierarchyDefFiltersService } from './HierarchyDefFilters.service';

@Injectable()
export class HierarchyFilterContainerService implements IFilterContainer {

    filtersTemplateService: any;
    constructor(public filtersService: HierarchyDefFiltersService,
                public filtersNewService: HierarchyAddFiltersService) {
    }

    updateIdHierarchy(idHierarchy: number) {
        this.filtersService.idHierarchy = idHierarchy;
        this.filtersNewService.idHierarchy = idHierarchy;
    }
}
