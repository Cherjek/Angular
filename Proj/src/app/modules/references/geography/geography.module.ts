import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

import { GeographyRoutingModule } from './geography-routing.module';
import { GeoViewComponent } from './components/geo-view/geo-view.component';
import { GeographyService } from 'src/app/services/references/geography.service';


@NgModule({
  declarations: [GeoViewComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    GeographyRoutingModule
  ],
  providers: [GeographyService]
})
export class GeographyModule { }
