import { NgModule } from '@angular/core';
import { TypesLogicDevicesCardRoutingModule } from './types-logic-devices-card.routing.module';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { TypesLogicDevicesCardComponent } from './components/types-logic-devices-card/types-logic-devices-card.component';
import { TypesLogicDevicesCardPropertyComponent } from './components/types-logic-devices-card-property/types-logic-devices-card-property.component';
import { LogicDeviceTypesService } from 'src/app/services/configuration/logic-device-types.service';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { TypesLogicDevicesCardTagComponent } from './components/types-logic-devices-card-tag/types-logic-devices-card-tag.component';
import { LogicDeviceTagTypesService } from 'src/app/services/references/logic-device-tag-types.service';
import { TypesLogicDevicesCardKindComponent } from './components/types-logic-devices-card-kind/types-logic-devices-card-kind.component';
import { LogicDeviceKindsService } from 'src/app/services/references/logic-device-kinds.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    TypesLogicDevicesCardRoutingModule
  ],
  declarations: [
    TypesLogicDevicesCardComponent,
    TypesLogicDevicesCardPropertyComponent,
    TypesLogicDevicesCardTagComponent,
    TypesLogicDevicesCardKindComponent
  ],
  providers: [
    LogicDeviceTypesService,
    LogicDeviceTagTypesService,
    LogicDeviceKindsService
  ]
})
export class TypesLogicDevicesCardModule {}
