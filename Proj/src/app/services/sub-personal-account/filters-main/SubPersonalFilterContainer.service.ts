import { Injectable } from '@angular/core';
import { IFilterContainer } from '../../common/Models/Filters/IFilterContainer';

import { SubPersonalAddFiltersService } from './SubPersonalAddFilters.service';
import { SubPersonalDefFiltersService } from './SubPersonalDefFilters.service';

@Injectable()
export class SubPersonalFilterContainerService implements IFilterContainer {
  filtersTemplateService: any;
  constructor(
    public filtersService: SubPersonalDefFiltersService,
    public filtersNewService: SubPersonalAddFiltersService
  ) {}
}
