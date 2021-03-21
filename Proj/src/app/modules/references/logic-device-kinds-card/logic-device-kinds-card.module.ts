import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { LogicDeviceKindsCardRoutingModule } from './logic-device-kinds-card.routing.module';
import { LogicDeviceKindsCardMainComponent } from './components/logic-device-kinds-card-main/logic-device-kinds-card-main.component';
import { LogicDeviceKindsService } from 'src/app/services/references/logic-device-kinds.service';
import { LogicDeviceKindsCardPropertyComponent } from './components/logic-device-kinds-card-property/logic-device-kinds-card-property.component';
import { SharedHierarchyModule } from '../../additionally-hierarchies/shared/shared.module';
import { LogicDeviceKindsCardParametersComponent } from './components/logic-device-kinds-card-parameters/logic-device-kinds-card-parameters.component';
import { LogicDeviceKindService } from 'src/app/services/references/logic-device-kind-types.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    LogicDeviceKindsCardRoutingModule
  ],
  declarations: [
    LogicDeviceKindsCardMainComponent,
    LogicDeviceKindsCardPropertyComponent,
    LogicDeviceKindsCardParametersComponent
  ],
  providers: [LogicDeviceKindsService, LogicDeviceKindService]
})
export class LogicDeviceKindsCardModule {}
