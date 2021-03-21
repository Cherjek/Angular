import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyTreeComponent } from './components/property-tree/property-tree.component';
import { PropertyUpdateEntityTypesService } from 'src/app/services/property-update/entity/property-update-entity-types.service';
import { PropertiesTreeRoutingModule } from './properties-tree.routing.module';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [
    PropertyTreeComponent
  ],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    PropertiesTreeRoutingModule
  ],
  providers: [
    PropertyUpdateEntityTypesService
  ],
})
export class PropertiesTreeModule { }
