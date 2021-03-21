import { Injectable } from '@angular/core';
import { IFilterContainer } from '../../../common/Models/Filters/IFilterContainer';

import { ExportImportQueueAddFiltersService } from './ExportImportQueueAddFilters.service';
import { ExportImportQueueDefFiltersService } from './ExportImportQueueDefFilters.service';

@Injectable()
export class ExportImportQueueFilterContainerService implements IFilterContainer {
  
  filtersTemplateService: any;
  constructor(
    public filtersService: ExportImportQueueDefFiltersService,
    public filtersNewService: ExportImportQueueAddFiltersService
  ) {}
  
}
