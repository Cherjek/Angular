import { Injectable } from "@angular/core";
import { IFilterContainer } from '../../../../common/Models/Filters/IFilterContainer';
import { LDETagsFiltersService } from './LDETagsFilters.service';
import { LDETagsAllFiltersService } from "./LDETagsAllFilters.service"

@Injectable()
export class LDETagsFilterContainerService implements IFilterContainer {

    filtersTemplateService: any;

    constructor(
        public filtersService: LDETagsFiltersService,
        public filtersNewService: LDETagsAllFiltersService) {
    }
}