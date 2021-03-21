import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../controls/ct.module';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';

import { DataPresentationRoutingModule } from './data-presentation-routing.module';
import { DataPresentationCreateComponent } from './components/data-presentation-create/data-presentation-create.component';
import { DataPresentationGridComponent } from './containers/data-presentation-grid/data-presentation-grid.component';
import { BasketFooterComponent } from './containers/basket-footer/basket-footer.component';

@NgModule({
  declarations: [DataPresentationCreateComponent, DataPresentationGridComponent, BasketFooterComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    DataPresentationRoutingModule
  ],
  providers: []
})
export class DataPresentationModule { }
