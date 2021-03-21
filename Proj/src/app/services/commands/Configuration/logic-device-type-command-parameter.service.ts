import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { Observable } from 'rxjs';
import { ILogicDeviceCommandTypeParameter } from '../Models/LogicDeviceCommandTypeParameter';

@Injectable()
export class LogicDeviceTypeCommandParameterService extends WebService<ILogicDeviceCommandTypeParameter> {
  URL = 'configuration/logic-device-command-types';

  idDeviceType: number;
  idDeviceTypeCommand: number;
  idParameter: number;

  private get concatURL() {
      return `${this.idDeviceTypeCommand}/parameters`;
  }

  getParameters() {
      return super.get(this.concatURL) as Observable<ILogicDeviceCommandTypeParameter[]>;
  }

  getParameter() {
      return super.get(`${this.concatURL}/${this.idParameter}`) as Observable<ILogicDeviceCommandTypeParameter>;
  }

  postParameter(device: ILogicDeviceCommandTypeParameter) {
      return super.post(device, this.concatURL);
  }

  deleteParameter(parameterId: number) {
      return super.delete('', `${this.concatURL}/${parameterId}`);
  }

}
