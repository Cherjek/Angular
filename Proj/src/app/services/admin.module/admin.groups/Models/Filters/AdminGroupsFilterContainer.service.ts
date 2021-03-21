import { Injectable } from "@angular/core";
import { IFilterContainer } from "../../../../common/Models/Filters/IFilterContainer";
import { AdminGroupsFiltersNewService } from "./AdminGroupsFiltersNew.service";
import { AdminGroupsFiltersService } from "./AdminGroupsFilters.service";

@Injectable()
export class AdminGroupsFilterContainerService implements IFilterContainer {

    filtersTemplateService: any;

    constructor(
        public filtersNewService: AdminGroupsFiltersNewService,
        public filtersService: AdminGroupsFiltersService
    ) {}
}