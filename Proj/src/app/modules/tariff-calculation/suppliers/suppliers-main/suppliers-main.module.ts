import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SuppliersMainComponent } from './components/suppliers-main.component';
import { SuppliersMainRoutes } from './suppliers-main.routing';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import { SuppliersChangeComponent } from '../suppliers-card/components/suppliers-change/suppliers-change.component';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SuppliersMainRoutes
  ],
  declarations: [SuppliersMainComponent, SuppliersChangeComponent],
  providers: [SuppliersService]
})
export class SuppliersMainModule { }
