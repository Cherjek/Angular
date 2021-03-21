import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { PersonalAccountRequestRoutes } from './request.routing';
import { RequestMainComponent } from './components/request-main/request-main.component';
import { RequestService } from 'src/app/services/sub-personal-account/requests/request.service';
import { RequestsFilterContainerService } from 'src/app/services/sub-personal-account/requests/Filters/RequestsFilterContainer.service';
import { RequestsAddFiltersService } from 'src/app/services/sub-personal-account/requests/Filters/RequestsAddFilters.service';
import { RequestsDefFiltersService } from 'src/app/services/sub-personal-account/requests/Filters/RequestsDefFilters.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    PersonalAccountRequestRoutes
  ],
  declarations: [
    RequestMainComponent
  ],
  providers: [
    RequestService,
    RequestsFilterContainerService, 
    RequestsAddFiltersService, 
    RequestsDefFiltersService
  ]
})
export class PersonalAccountRequestModule { }
