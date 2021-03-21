import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestResultRoutingModule } from './request-result-routing.module';
import { RequestResultComponent } from './components/request-result/request-result.component';
import { RequestResultLogComponent } from './components/request-result-log/request-result-log.component';
import { RequestResultEquipmentsComponent } from './components/request-result-equipments/request-result-equipments.component';
import { RequestResultParametersComponent } from './components/request-result-parameters/request-result-parameters.component';
import { RequestResultStepsComponent } from './components/request-result-steps/request-result-steps.component';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { DataResultSettingsService } from 'src/app/services/datapresentation.module/DataResultSettings.service';

@NgModule({
  declarations: [
    RequestResultComponent,
    RequestResultLogComponent,
    RequestResultEquipmentsComponent,
    RequestResultParametersComponent,
    RequestResultStepsComponent
  ],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    RequestResultRoutingModule
  ],
  providers: [DataResultSettingsService]
})
export class RequestResultModule {}
