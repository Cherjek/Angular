import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';
import { PaSubscribersMainComponent } from './components/pa-subscribers-main/pa-subscribers-main.component';
import { PaSubscribersRoutingModule } from './pa-subscribers.routing.module';
import { SubPersonalDefFiltersService } from 'src/app/services/sub-personal-account/filters-main/SubPersonalDefFilters.service';
import { SubPersonalFilterContainerService } from 'src/app/services/sub-personal-account/filters-main/SubPersonalFilterContainer.service';
import { SubPersonalAddFiltersService } from 'src/app/services/sub-personal-account/filters-main/SubPersonalAddFilters.service';
import { PaSubscriberCardService } from 'src/app/services/sub-personal-account/pa-subscriber-card.service';
import { SubscribersMainService } from 'src/app/services/sub-personal-account/subscribers-main.service';

@NgModule({
  declarations: [PaSubscribersMainComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    PaSubscribersRoutingModule,
  ],
  providers: [
    SubscribersMainService,
    SubPersonalAccountService,
    SubPersonalFilterContainerService,
    SubPersonalDefFiltersService,
    SubPersonalAddFiltersService,
    PaSubscriberCardService,
  ],
})
export class PaSubscribersModule {}
