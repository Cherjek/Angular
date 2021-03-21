import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { CalculationTaskParameters } from '../tariff-calculation-create/Models/CalculationTaskParameters';

@Injectable({
  providedIn: 'root'
})
export class TariffCalculationTemplateService extends WebService<CalculationTaskParameters> {
  URL: string = "tariff-calc/main";

  saveTemplate(data: any) {
    return super.post(data, 'create-template');
  }

  getTemplates() {
    return super.get('templates');
  }

  getTemplate(id: number) {
    return super.get(`templates/${id}`)
  }

  deleteTemplate(id: number) {
    return super.delete(id, 'templates')
  }
}
