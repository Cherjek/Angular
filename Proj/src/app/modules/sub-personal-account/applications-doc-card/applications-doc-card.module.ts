import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { AppDocTypeCardPropertyComponent } from './components/app-doc-type-card-property/app-doc-type-card-property.component';
import { AppDocTypeCardComponent } from './components/app-doc-type-card/app-doc-type-card.component';
import { AppDocTypeCardRoutingModule } from './applications-doc-card.module.routing';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    AppDocTypeCardRoutingModule,
  ],
  declarations: [AppDocTypeCardComponent, AppDocTypeCardPropertyComponent],
})
export class AppDocTypeCardModule {}
