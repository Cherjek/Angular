import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { OesMainComponent } from './components/oes-main/oes-main.component';
import { OesRoutingModule } from './oes.routing.module';
import { OesService } from 'src/app/services/tariff-calculator/oes.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    OesRoutingModule,
  ],
  declarations: [OesMainComponent],
  providers: [OesService],
})
export class OesModule {}
