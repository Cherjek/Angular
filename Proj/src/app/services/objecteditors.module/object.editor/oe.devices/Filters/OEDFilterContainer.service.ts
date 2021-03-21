import { Injectable } from "@angular/core";
import { IFilterContainer } from "../../../../common/Models/Filters/IFilterContainer";
import { OEDFiltersService } from './OEDFilters.service';
import { OEDAllFiltersService } from './OEDAllFilters.service';

@Injectable()
export class OEDFilterContainerService implements IFilterContainer {

    filtersTemplateService: any;

    constructor(
        public filtersNewService: OEDAllFiltersService,
        public filtersService: OEDFiltersService
    ) {}

    setId(id: any) {
        this.filtersService.Id = id;
        this.filtersNewService.Id = id;
    }
}