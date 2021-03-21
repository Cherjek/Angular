import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../controls/ct.module';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';

import { HierarchyMainRoutingModule } from './hierarchy-main-routing.module';
import { HierarchyMainComponent } from './components/hierarchy-main/hierarchy-main.component';
import { NodeCardModule } from '../additionally-hierarchies/node-card/node-card.module';

import { HierarchyFilterContainerService } from '../../services/hierarchy-main/Filters/HierarchyFilterContainer.service';
import { HierarchyDefFiltersService } from '../../services/hierarchy-main/Filters/HierarchyDefFilters.service';
import { HierarchyAddFiltersService } from '../../services/hierarchy-main/Filters/HierarchyAddFilters.service';
import { HierarchyFiltersTemplateService } from '../../services/hierarchy-main/Filters/HierarchyFiltersTemplate.service';
import { HierarchyMapComponent } from './components/hierarchy-map/hierarchy-map.component';
import { IsDataRottenPipe } from './components/hierarchy-main/pipes/is-data-rotten.pipe';
import { ColorStatePipe } from './components/hierarchy-main/pipes/color-state.pipe';
import { ValueFromArrayPipe } from './components/hierarchy-main/pipes/value-from-array.pipe';
import { CustomStateFilterComponent } from './components/hierarchy-main/components/custom-state-filter.component';

@NgModule({
  declarations: [
    HierarchyMainComponent, 
    HierarchyMapComponent, 
    IsDataRottenPipe, 
    ColorStatePipe, 
    ValueFromArrayPipe,
    CustomStateFilterComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    HierarchyMainRoutingModule,
    NodeCardModule
  ],
  providers: [HierarchyFilterContainerService, HierarchyDefFiltersService, HierarchyAddFiltersService, HierarchyFiltersTemplateService]
})
export class HierarchyMainModule { }
