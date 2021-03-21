import { AppLocalization } from 'src/app/common/LocaleRes';
import { of, Observable } from 'rxjs';
import { WebService } from 'src/app/services/common/Data.service';
import { Injectable } from '@angular/core';
import { TariffTransfer } from './models/tariff-transfer';
import { SupplyOrganizationType } from './models/supply-organization-type';
import { TariffAttachment } from './models/tariff-attachment';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class TariffTransferService extends WebService<TariffTransfer | any> {
  URL = 'tariff-calc/transfer-tariffs';

  idRegion: number | string;
  idTariffTransfer: number | string;

  get() {
    return super.get(this.idRegion);
  }

  getSupplyOrg() {
    return of([
      {
        Id: 1,
        Code: 'TSO',
        Name: AppLocalization.Label108,
      },
      {
        Id: 2,
        Code: 'FSK220',
        Name: AppLocalization.Label112,
      },
      {
        Id: 3,
        Code: 'FSK330',
        Name: AppLocalization.Label113,
      },
    ] as SupplyOrganizationType[]);
  }

  getTariffTransfer() {
    return super.get(`${this.idRegion}/${this.idTariffTransfer}`);
  }

  deleteTariffTransfer(itemId: number) {
    return super.delete(itemId, `${this.idRegion}`);
  }

  postTariffTransfer(item: TariffTransfer) {
    item.IdTariffRegion = +this.idRegion;
    return super.post(item, `${this.idRegion}`);
  }

  getAttachments(): Observable<TariffAttachment[]> {
    return super.get(`${this.idRegion}/${this.idTariffTransfer}/attach`);
  }

  deleteAttachment(itemId: number) {
    return super.delete(
      itemId,
      `${this.idRegion}/${this.idTariffTransfer}/attach`
    );
  }

  saveFile(file: File) {
    const formData: FormData = new FormData();
    formData.append("files", file, file.name);
    return super.postFormData(formData, `${this.idRegion}/${this.idTariffTransfer}/attach`)
  }

  getFile(file: string) {
    let params = new HttpParams();
    params = params.append('files', file);
    return super.loadBinaryData(`${this.idRegion}/${this.idTariffTransfer}/attach/files`, params);
  }
}
