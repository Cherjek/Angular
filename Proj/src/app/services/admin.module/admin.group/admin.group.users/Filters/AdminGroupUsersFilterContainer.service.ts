import { Injectable } from "@angular/core";
import { IFilterContainer } from '../../../../common/Models/Filters/IFilterContainer';

import { AdminGroupUsersAddFiltersService } from "./AdminGroupUsersAddFilters.service";
import { AdminGroupUsersDefFiltersService } from "./AdminGroupUsersDefFilters.service";

@Injectable()
export class AdminGroupUsersFilterContainerService implements IFilterContainer {

    filtersTemplateService: any;

    constructor(
        public filtersService: AdminGroupUsersDefFiltersService,
        public filtersNewService: AdminGroupUsersAddFiltersService) {
    }
}