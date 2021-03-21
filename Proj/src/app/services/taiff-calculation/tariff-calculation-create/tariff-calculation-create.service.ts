import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebService } from '../../common/Data.service';
import { IData } from '../../configuration/Models/Data';
import { CalculationTaskParameters } from './Models/CalculationTaskParameters';
import { CalculationGroup } from './Models/Group';

@Injectable({
  providedIn: 'root'
})
export class TariffCalculationCreateService extends WebService<IData> {
  URL: string = "tariff-calc/main";

  getCalculationTypes(): Observable<IData[]> {
    return super.get('calculation-types') as Observable<IData[]>;
  }

  getCalculationTypeReports(type: number): Observable<IData[]> {
    return super.get(`calculation-types/reports/${type}`) as Observable<IData[]>;
  }

  getGroups(data: any, key: string) {
    return super.post(data, `calculation-groups/${key}`);
  }

  save(idHierarchy: number, calculationTaskParameters: CalculationTaskParameters, groups: CalculationGroup[]) {
    const formData: FormData = new FormData();
    (groups || []).forEach(group => {
      var _v = {...group};
      if (group.File) {
        formData.append("files", _v.File, _v.File.name);
        _v.File = { Name: _v.File.name };
      }
      formData.append("groups", JSON.stringify(_v));
    });  
    formData.append('params', JSON.stringify(calculationTaskParameters));  
    return super.postFormData(formData, `tasks/start/${idHierarchy}`);
  }
}
