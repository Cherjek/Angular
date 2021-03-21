import { NgModule } from '@angular/core';
import { CommandCardComponent } from './components/command-card/command-card.component';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { CommandCardRoutingModule } from './command-card.routing.module';
import { ReferenceDeviceCommandTypesService } from 'src/app/services/commands/Reference/reference-device-command-types.service';
import { CommandCardPropertiesComponent } from './components/command-card-properties/command-card-properties.component';
import { SharedHierarchyModule } from '../../../additionally-hierarchies/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,

    CommandCardRoutingModule
  ],
  exports: [],
  declarations: [CommandCardComponent, CommandCardPropertiesComponent],
  providers: [ReferenceDeviceCommandTypesService]
})
export class CommandCardModule {}
