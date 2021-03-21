import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../controls/ct.module';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';

import { JournalSystemEventsRoutingModule } from './journal-system-events-routing.module';
import { JournalSystemEventsComponent } from './components/journal-system-events-main/journal-system-events.component';

import { JournalsFilterContainerService } from '../../services/journal-system-events/Filters/JournalsFilterContainer.service';
import { JournalsDefFiltersService } from '../../services/journal-system-events/Filters/JournalsDefFilters.service';
import { JournalsAddFiltersService } from '../../services/journal-system-events/Filters/JournalsAddFilters.service';
import { JournalsFiltersTemplateService } from '../../services/journal-system-events/Filters/JournalsFiltersTemplate.service';


@NgModule({
  declarations: [JournalSystemEventsComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    JournalSystemEventsRoutingModule
  ],
  providers: [JournalsFilterContainerService, JournalsDefFiltersService, JournalsAddFiltersService, JournalsFiltersTemplateService]
})
export class JournalSystemEventsMainModule { }
