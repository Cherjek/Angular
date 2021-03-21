import { PaApplicationsCardDocTypesComponent } from './components/pa-applications-card-doc-types/pa-applications-card-doc-types.component';
import { PaApplicationsCardTypeTagsComponent } from './components/pa-applications-card-type-tags/pa-applications-card-type-tags.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule as Sh } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { PaApplicationsCardPropertyComponent } from './components/pa-applications-card-property/pa-applications-card-property.component';
import { PaApplicationsCardComponent } from './components/pa-applications-card/pa-applications-card.component';
import { PaApplicationsCardRoutingModule } from './pa-applications-card.routing.module';
import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';
import { HierarchyMainService } from 'src/app/services/hierarchy-main';
import { SharedModule } from '../../requests/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    Sh,
    CoreModule,
    SharedModule,
    SharedHierarchyModule,
    PaApplicationsCardRoutingModule,
  ],
  declarations: [
    PaApplicationsCardComponent,
    PaApplicationsCardTypeTagsComponent,
    PaApplicationsCardPropertyComponent,
    PaApplicationsCardDocTypesComponent,
  ],
  providers: [SubPersonalAccountService, HierarchyMainService],
})
export class PaApplicationsCardModule {}
