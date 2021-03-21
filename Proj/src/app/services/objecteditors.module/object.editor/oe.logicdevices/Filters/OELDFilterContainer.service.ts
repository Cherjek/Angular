import { Injectable } from "@angular/core";
import { IFilterContainer } from "../../../../common/Models/Filters/IFilterContainer";
import { OELDFiltersService } from './OELDFilters.service';
import { OELDAllFiltersService } from './OELDAllFilters.service';

@Injectable()
export class OELDFilterContainerService implements IFilterContainer {

    filtersTemplateService: any;

    constructor(
        public filtersNewService: OELDAllFiltersService,
        public filtersService: OELDFiltersService
    ) {}

    setId(id: any) {
        this.filtersService.Id = id;
        this.filtersNewService.Id = id;
    }
}