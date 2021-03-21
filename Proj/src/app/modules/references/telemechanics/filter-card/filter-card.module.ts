import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { FilterCardRoutingModuleModule } from './filter-card.routing.module';
import { FilterCardBoundComponent } from './components/filter-card-bound/filter-card-bound.component';
import { FilterCardMainComponent } from './components/filter-card-main/filter-card-main.component';
import { FilterCardTagTypesComponent } from './components/filter-card-tag-types/filter-card-tag-types.component';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    FilterCardRoutingModuleModule
  ],
  declarations: [
    FilterCardBoundComponent,
    FilterCardMainComponent,
    FilterCardTagTypesComponent
  ],
  providers: []
})
export class FilterCardModule {}
