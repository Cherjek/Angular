import { Injectable } from '@angular/core';
import { IFilterContainer } from '../../common/Models/Filters/IFilterContainer';

import { HierarchyEditorAddFiltersService } from './HierarchyEditorAddFilters.service';
import { HierarchyEditorDefFiltersService } from './HierarchyEditorDefFilters.service';

@Injectable()
export class HierarchyEditorFilterContainerService implements IFilterContainer {

    filtersTemplateService: any;

    constructor(public filtersService: HierarchyEditorDefFiltersService,
                public filtersNewService: HierarchyEditorAddFiltersService) {}
}
