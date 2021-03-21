import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { PersonalAccountRequestCardRoutes } from './request-card.routing';
import { PaRequestCardComponent } from './components/pa-request-card/pa-request-card.component';
import { PaRequestCardMainComponent } from './components/pa-request-card-main/pa-request-card-main.component';
import { PaRequestCardHierarchyNodeComponent } from './components/pa-request-card-hierarchy-node/pa-request-card-hierarchy-node.component';
import { RequestService } from 'src/app/services/sub-personal-account/requests/request.service';
import { NodeCardModule } from '../../additionally-hierarchies/node-card/node-card.module';
import { PaRequestCardFilesComponent } from './components/pa-request-card-files/pa-request-card-files.component';
import { PaRequestCardRejectComponent } from './components/pa-request-card-reject/pa-request-card-reject.component';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    PersonalAccountRequestCardRoutes,
    NodeCardModule,
  ],
  declarations: [
    PaRequestCardComponent,
    PaRequestCardMainComponent,
    PaRequestCardHierarchyNodeComponent,
    PaRequestCardFilesComponent,
    PaRequestCardRejectComponent,
  ],
  providers: [RequestService],
})
export class PersonalAccountRequestCardModule {}
