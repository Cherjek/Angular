import { Injectable } from '@angular/core';
import { Utils } from 'src/app/core';
import { WebService } from '../../common/Data.service';
import { IInlineGrid } from '../../common/Interfaces/IInlineGrid';
import { TariffSupplierFactPeakPower } from './Models/TariffSupplierFactPeakPower';

@Injectable()
export class SuppliersPeakPowersService  extends WebService<TariffSupplierFactPeakPower>
  implements IInlineGrid {
  
  params: any;
  URL = `tariff-calc/suppliers`;
  
  getInfrastructure(idTariffSupplierFactPeakPower: number) {
    return super.get(`${this.params.id}/fact-peak-powers/${idTariffSupplierFactPeakPower}`);
  }
  
  getNewInfrastructure() {
    return super.get(`${this.params.id}/fact-peak-powers/new`);
  }

  read() {
    return super.get(`${this.params.id}/fact-peak-powers`);
  }

  create(data: TariffSupplierFactPeakPower) {
    data.IdTariffSupplier = this.params.id;
    data.Date = Utils.DateConvert.toDateTimeRequest(data.Date) as any
    return super.post(data, `${this.params.id}/fact-peak-powers`);
  }

  remove(idTariffSupplierFactPeakPower: number) {
    return super.delete(idTariffSupplierFactPeakPower, `${this.params.id}/fact-peak-powers`);
  }
}