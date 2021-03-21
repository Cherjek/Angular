import { Injectable } from '@angular/core';
import { IFilterContainer } from '../../common/Models/Filters/IFilterContainer';
import { SubPersonalDocsAddFiltersService } from './SubPersonalDocsAddFilters.service';
import { SubPersonalDocsDefFiltersService } from './SubPersonalDocsDefFilters.service';

@Injectable()
export class SubPersonalDocsFilterContainerService implements IFilterContainer {
  filtersTemplateService: any;
  constructor(
    public filtersService: SubPersonalDocsDefFiltersService,
    public filtersNewService: SubPersonalDocsAddFiltersService
  ) {}
}
