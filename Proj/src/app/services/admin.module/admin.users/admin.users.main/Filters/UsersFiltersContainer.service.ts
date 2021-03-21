import { Injectable } from "@angular/core";
import { UsersFiltersService } from './UsersFilters.service';
import { UsersNewFiltersService } from './UsersNewFilters.service';
import { IFilterContainer } from "../../../../common/Models/Filters/IFilterContainer";

@Injectable()
export class UsersFiltersContainerService implements IFilterContainer {
    filtersTemplateService: any;

    constructor(
        public filtersService: UsersFiltersService,
        public filtersNewService: UsersNewFiltersService) {}
}