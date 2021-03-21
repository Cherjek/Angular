import { SupplierAddition } from './Models/supplier-addition';
import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { TariffSupplier } from './Models/TariffSupplier';
import { SupplierEnergyPrice } from './Models/supplier-energy-price';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class SuppliersService extends WebService<
  TariffSupplier | SupplierAddition | SupplierEnergyPrice
> {
  URL = 'tariff-calc/suppliers';
  idSupplier: number;
  idAddition: number;
  idEnergyPrice: number;
  getSupplier(idSupplier: number | string) {
    return super.get(`${idSupplier}`);
  }

  getSupplierAdditions() {
    return super.get(`${this.idSupplier}/addition`);
  }

  getSupplierAddition() {
    return super.get(`${this.idSupplier}/addition/${this.idAddition}`);
  }

  postSupplierAddition(data: SupplierAddition) {
    data.IdTariffSupplier = this.idSupplier;
    return super.post(data, `${this.idSupplier}/addition`);
  }

  deleteSupplierAddition(itemId: number) {
    return super.delete(itemId, `${this.idSupplier}/addition`);
  }

  getSupplierFiles() {
    return super.get(`${this.idSupplier}/addition/${this.idAddition}/attach`);
  }

  deleteSupplierFile(itemId: number) {
    return super.delete(
      itemId,
      `${this.idSupplier}/addition/${this.idAddition}/attach`
    );
  }

  getSupplierEnergyPrices() {
    return super.get(`${this.idSupplier}/energy-price`);
  }

  getSupplierEnergyPrice() {
    return super.get(`${this.idSupplier}/energy-price/${this.idEnergyPrice}`);
  }

  postSupplierEnergyPrice(data: SupplierEnergyPrice) {
    data.IdTariffSupplier = this.idSupplier;
    return super.post(data, `${this.idSupplier}/energy-price`);
  }

  deleteSupplierEnergyPrice(itemId: number) {
    return super.delete(itemId, `${this.idSupplier}/energy-price`);
  }

  replace(data: any) {
    return super.post(data, `replace`);
  }

  saveFile(file: File) {
    const formData: FormData = new FormData();
    formData.append("files", file, file.name);
    return super.postFormData(formData, `${this.idSupplier}/addition/${this.idAddition}/attach`)
  }

  getFile(file: string) {
    let params = new HttpParams();
    params = params.append('files', file);
    return super.loadBinaryData(`${this.idSupplier}/addition/${this.idAddition}/attach/files`, params);
  }
}
