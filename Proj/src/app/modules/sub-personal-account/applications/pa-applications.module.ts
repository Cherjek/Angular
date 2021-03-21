import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

import { PaApplicationsMainComponent } from './components/pa-applications-main/pa-applications-main.component';
import { PaApplicationsRoutingModule } from './pa-applications.routing.module';
import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';

@NgModule({
  declarations: [PaApplicationsMainComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    PaApplicationsRoutingModule,
  ],
  providers: [SubPersonalAccountService],
})
export class PaApplicationsModule {}
