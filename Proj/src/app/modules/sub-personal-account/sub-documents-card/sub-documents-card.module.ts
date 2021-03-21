import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule as Sh } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { SharedModule } from '../../requests/shared/shared.module';
import { SubDocumentsCardPropertyComponent } from './components/sub-documents-card-property/sub-documents-card-property.component';
import { SubDocumentsCardComponent } from './components/sub-documents-card/sub-documents-card.component';
import { SubDocumentsCardRoutingModule } from './sub-documents-card.module.routing';
import { SubPersonalAccountDocsService } from 'src/app/services/sub-personal-account/sub-personal-account-docs.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    Sh,
    CoreModule,
    SharedModule,
    SharedHierarchyModule,
    SubDocumentsCardRoutingModule,
  ],
  declarations: [SubDocumentsCardComponent, SubDocumentsCardPropertyComponent],
  providers: [SubPersonalAccountDocsService],
})
export class SubDocumentsCardModule {}
