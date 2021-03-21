import { WebService } from 'src/app/services/common/Data.service';
import { Injectable } from '@angular/core';
import { IInlineGrid } from '../common/Interfaces/IInlineGrid';
import { AgreementType } from './models/agreement-type';

@Injectable({
  providedIn: 'root',
})
export class AgreementTypesService
  extends WebService<AgreementType>
  implements IInlineGrid {
  URL = 'tariff-calc/agreement-types';
  params: any;

  read() {
    return this.get();
  }

  create(data: AgreementType) {
    return this.post(data, this.params.id);
  }

  remove(itemId: number) {
    return this.delete(itemId);
  }
}
