import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule as Sh } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';
import { HierarchyMainService } from 'src/app/services/hierarchy-main';
import { SharedModule } from '../../requests/shared/shared.module';
import { PaSubscribersCardPropertyComponent } from './components/pa-subscribers-card-property/pa-subscribers-card-property.component';
import { PaSubscribersCardComponent } from './components/pa-subscribers-card/pa-subscribers-card.component';
import { PaSubscribersCardRoutingModule } from './pa-subscribers-card.routing.module';
import { PaSubscriberCardService } from 'src/app/services/sub-personal-account/pa-subscriber-card.service';
import { PaHierarchyNodesComponent } from './components/pa-hierarchy-nodes/pa-hierarchy-nodes.component';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    Sh,
    CoreModule,
    SharedModule,
    SharedHierarchyModule,
    PaSubscribersCardRoutingModule,
  ],
  declarations: [
    PaSubscribersCardComponent,
    PaSubscribersCardPropertyComponent,
    PaHierarchyNodesComponent,
  ],
  providers: [
    SubPersonalAccountService,
    HierarchyMainService,
    PaSubscriberCardService,
  ],
})
export class PaSubscribersCardModule {}
