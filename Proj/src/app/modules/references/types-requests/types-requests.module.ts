import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { TypesRequestsRoutingModule } from './types-requests.routing.module';
import { DataQueryTypesService } from 'src/app/services/references/data-query-types.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    TypesRequestsRoutingModule
  ],
  providers: [DataQueryTypesService]
})
export class TypesRequestsModule {}
