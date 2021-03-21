import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { Observable } from 'rxjs';
import { ILogicDeviceCommandTypeParameterOption } from '../Models/LogicDeviceCommandTypeParameterOption';

@Injectable()
export class LogicDeviceTypeCommandParameterOptionService extends WebService<ILogicDeviceCommandTypeParameterOption> {
  URL = 'configuration/logic-device-command-types';

  idDeviceType: number;
  idParameter: number;
  idOption: number;

  private get concatURL() {
    return `${this.idDeviceType}/parameters/${this.idParameter}/options`;
  }

  getDeviceTypeCommandParameterOptions() {
    return super.get(this.concatURL) as Observable<ILogicDeviceCommandTypeParameterOption[]>;
  }

  getDeviceTypeCommandParameterOption() {
    return super.get(`${this.concatURL}/${this.idOption}`) as Observable<ILogicDeviceCommandTypeParameterOption>;
  }

  postDeviceTypeCommandParameterOption(
    option: ILogicDeviceCommandTypeParameterOption
  ) {
    return super.post(option, this.concatURL);
  }

  deleteDeviceTypeCommandParameterOption(optionId: number) {
    return super.delete(`${this.concatURL}/${optionId}`);
  }
}