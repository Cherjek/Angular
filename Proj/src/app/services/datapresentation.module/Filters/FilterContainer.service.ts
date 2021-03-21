import { Injectable } from "@angular/core";
import { IFilterContainer } from '../../common/Models/Filters/IFilterContainer';
import { FiltersService } from './Filters.service';
import { AllFiltersService } from './AllFilters.service';

@Injectable()
export class FilterDataPresentContainerService implements IFilterContainer {

    filtersTemplateService: any;

    constructor(
        public filtersService: FiltersService,        
        public filtersNewService: AllFiltersService) {
    }
}