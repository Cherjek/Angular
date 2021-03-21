import { AppLocalization } from 'src/app/common/LocaleRes';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AddressBookService } from 'src/app/services/notifications/address-book.service';
import { IInlineGridRouteData } from 'src/app/shared/rom-forms/inline-grid/models/InlineGridDataColumn';

const routes: Routes = [
  {
    path: '',
    component: InlineGridComponent,
    data: {
      service: AddressBookService,
      columns: [
        {
          Name: 'Name',
          Caption: AppLocalization.Name,
          IsRequired: true,
          MaxLength: 125,
        },
        {
          Name: 'EMail',
          Caption: AppLocalization.Email,
          IsRequired: true,
          MaxLength: 125,
        },
        {
          Name: 'PhoneNumber',
          Caption: AppLocalization.PhoneNumber,
          IsRequired: true,
          MaxLength: 125,
        },
      ],
      title: AppLocalization.AddressBook,
      access: 'REF_EDIT_ADDRESS_BOOK'
    } as IInlineGridRouteData,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddressBookRoutingModule {}
