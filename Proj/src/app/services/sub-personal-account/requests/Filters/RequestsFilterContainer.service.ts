import { Injectable } from "@angular/core";
import { IFilterContainer } from '../../../common/Models/Filters/IFilterContainer';

import { RequestsAddFiltersService } from "./RequestsAddFilters.service";
import { RequestsDefFiltersService } from "./RequestsDefFilters.service";

@Injectable()
export class RequestsFilterContainerService implements IFilterContainer {

    filtersTemplateService: any;

    constructor(public filtersService: RequestsDefFiltersService,
                public filtersNewService: RequestsAddFiltersService) {}
}