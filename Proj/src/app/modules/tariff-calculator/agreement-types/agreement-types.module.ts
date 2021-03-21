import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { AgreementTypesRoutingModule } from './agreement-types.routing.module';
import { AgreementTypesService } from 'src/app/services/tariff-calculator/agreement-types.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    AgreementTypesRoutingModule,
  ],
  providers: [AgreementTypesService],
})
export class AgreementTypesModule {}
