import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { AddressBookRoutingModule } from './address-book.routing.module';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    AddressBookRoutingModule,
  ],
})
export class AddressBookModule {}
