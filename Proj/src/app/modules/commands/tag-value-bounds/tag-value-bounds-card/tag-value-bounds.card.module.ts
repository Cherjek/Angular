import { LogicTagTypesService } from 'src/app/services/references/logic-tag-types.service';
import { TagValueBoundsCardLogicDevicesComponent } from './components/tag-value-bounds-card-logic-devices/tag-value-bounds-card-logic-devices.component';
import { TagValueBoundsCardPropertyComponent } from './components/tag-value-bounds-card-property/tag-value-bounds-card-property.component';
import { NgModule } from '@angular/core';
import { TagValueBoundsCardComponent } from './components/tag-value-bounds-card/tag-value-bounds-card.component';
import { TagValueBoundsCardRoutingModule } from './tag-value-bounds.routing.module';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { TagValueBoundsService } from 'src/app/services/commands/Configuration/tag-value-bounds.service';
import { DataQueryMainService } from 'src/app/services/data-query';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    TagValueBoundsCardRoutingModule,
  ],
  declarations: [
    TagValueBoundsCardComponent,
    TagValueBoundsCardPropertyComponent,
    TagValueBoundsCardLogicDevicesComponent,
  ],
  providers: [TagValueBoundsService, LogicTagTypesService],
})
export class TagValueBoundsCardModule {}
