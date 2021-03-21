import { Injectable } from "@angular/core";
import { IFilterContainer } from '../../common/Models/Filters/IFilterContainer';
import { FiltersService } from './Filters.service';
import { FiltersTemplateService } from './FiltersTemplate.service';
import { AllFiltersService } from './AllFilters.service';

@Injectable()
export class FilterObjectsContainerService implements IFilterContainer {

    constructor(
        public filtersService: FiltersService,
        public filtersTemplateService: FiltersTemplateService,
        public filtersNewService: AllFiltersService) {
    }
}