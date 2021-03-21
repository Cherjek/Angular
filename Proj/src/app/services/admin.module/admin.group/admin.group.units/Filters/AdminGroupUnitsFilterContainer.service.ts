import { Injectable } from "@angular/core";
import { IFilterContainer } from '../../../../common/Models/Filters/IFilterContainer';

import { AdminGroupUnitsAddFiltersService } from "./AdminGroupUnitsAddFilters.service";
import { AdminGroupUnitsDefFiltersService } from "./AdminGroupUnitsDefFilters.service";

@Injectable()
export class AdminGroupUnitsFilterContainerService implements IFilterContainer {

    filtersTemplateService: any;

    constructor(public filtersService: AdminGroupUnitsDefFiltersService,
                public filtersNewService: AdminGroupUnitsAddFiltersService) {}
}