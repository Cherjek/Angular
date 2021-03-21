import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

import { PaSubDocumentsMainComponent } from './components/pa-sub-documents-main/pa-sub-documents-main.component';
import { PaSubDocumentsRoutingModule } from './pa-sub-documents.module.routing';
import { SubPersonalDocsAddFiltersService } from 'src/app/services/sub-personal-account/filters-docs/SubPersonalDocsAddFilters.service';
import { SubPersonalDocsDefFiltersService } from 'src/app/services/sub-personal-account/filters-docs/SubPersonalDocsDefFilters.service';
import { SubPersonalDocsFilterContainerService } from 'src/app/services/sub-personal-account/filters-docs/SubPersonalDocsFilterContainer.service';
import { SubPersonalAccountDocsService } from 'src/app/services/sub-personal-account/sub-personal-account-docs.service';
import { SubscribersMainDocsService } from 'src/app/services/sub-personal-account/sub-docs-main.service';

@NgModule({
  declarations: [PaSubDocumentsMainComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    PaSubDocumentsRoutingModule,
  ],
  providers: [
    SubscribersMainDocsService,
    SubPersonalAccountDocsService,
    SubPersonalDocsFilterContainerService,
    SubPersonalDocsDefFiltersService,
    SubPersonalDocsAddFiltersService,
  ],
})
export class PaSubDocumentsModule {}
