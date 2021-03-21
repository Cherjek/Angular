import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IData } from '../configuration/Models/Data';

@Injectable({
  providedIn: 'root'
})
export class GeographyService extends WebService<IData> {
  URL = 'reference/geo';

  saveMacroRegion(macroRegion: IData) {
    return super.post(macroRegion, 'macro-region');
  }

  saveRegion(region: IData) {
    return super.post(region, 'region');
  }

  saveFilial(filial: IData) {
    return super.post(filial, 'filial');
  }

  saveEso(eso: IData) {
    return super.post(eso, 'eso');
  }

  deleteMacroRegion(macroRegion: number) {
    return super.delete(macroRegion, 'macro-region');
  }

  deleteRegion(region: number) {
    return super.delete(region, 'region');
  }

  deleteFilial(filial: number) {
    return super.delete(filial, 'filial');
  }

  deleteEso(eso: number) {
    return super.delete(eso, 'eso');
  }
}
