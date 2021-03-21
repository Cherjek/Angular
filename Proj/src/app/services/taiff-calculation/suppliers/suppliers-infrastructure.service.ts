import { Injectable } from '@angular/core';
import { Utils } from 'src/app/core';
import { WebService } from '../../common/Data.service';
import { IInlineGrid } from '../../common/Interfaces/IInlineGrid';
import { TariffSupplierInfrastructure } from './Models/TariffSupplierInfrastructure';

@Injectable()
export class SuppliersInfrastructureService  extends WebService<TariffSupplierInfrastructure>
  implements IInlineGrid {
  
  params: any;
  URL = `tariff-calc/suppliers`;
  
  getInfrastructure(idTariffSupplierInfrastructure: number) {
    return super.get(`${this.params.id}/infrastructure/${idTariffSupplierInfrastructure}`);
  }
  
  getNewInfrastructure() {
    return super.get(`${this.params.id}/infrastructure/new`);
  }

  read() {
    return super.get(`${this.params.id}/infrastructure`);
  }

  create(data: TariffSupplierInfrastructure) {
    data.IdTariffSupplier = this.params.id;
    data.Date = Utils.DateConvert.toDateTimeRequest(data.Date) as any
    return super.post(data, `${this.params.id}/infrastructure`);
  }

  remove(idTariffSupplierInfrastructure: number) {
    return super.delete(idTariffSupplierInfrastructure, `${this.params.id}/infrastructure`);
  }
}