import { Injectable } from '@angular/core';
import { IFilterContainer } from '../../common/Models/Filters/IFilterContainer';
import { PUExportImportQueueAddFiltersService } from './pu-export-import-queue-add-filters.service';
import { PUExportImportQueueDefFiltersService } from './pu-export-import-queue-def-filters.service';

@Injectable()
export class PUExportImportQueueFilterContainerService
  implements IFilterContainer {
  filtersTemplateService: any;
  constructor(
    public filtersService: PUExportImportQueueDefFiltersService,
    public filtersNewService: PUExportImportQueueAddFiltersService
  ) {}
}
