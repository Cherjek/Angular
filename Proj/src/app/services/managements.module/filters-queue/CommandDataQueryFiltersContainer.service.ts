import { Injectable } from '@angular/core';
import { IFilterContainer } from '../../common/Models/Filters/IFilterContainer';

import { CommandDataQueryAddFiltersService } from './CommandDataQueryAddFilters.service';
import { CommandDataQueryDefFiltersService } from './CommandDataQueryDefFilters.service';

@Injectable()
export class CommandDataQueryFiltersContainerService implements IFilterContainer {
  filtersTemplateService: any;
  constructor(
    public filtersService: CommandDataQueryDefFiltersService,
    public filtersNewService: CommandDataQueryAddFiltersService
  ) {}
}
