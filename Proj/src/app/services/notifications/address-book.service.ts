import { WebService } from 'src/app/services/common/Data.service';
import { IInlineGrid } from 'src/app/services/common/Interfaces/IInlineGrid';
import { Injectable } from '@angular/core';
import { AddressBook } from '../commands/Models/AddressBook';

@Injectable({
  providedIn: 'root',
})
export class AddressBookService extends WebService<AddressBook>
  implements IInlineGrid {
  URL = 'notification/address';
  params: any;

  read() {
    return this.get();
  }

  create(data: AddressBook) {
    return this.post(data, this.params.id);
  }

  remove(itemId: number) {
    return this.delete(itemId);
  }
}
