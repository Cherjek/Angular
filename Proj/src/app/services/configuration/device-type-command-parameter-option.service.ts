import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IDeviceTypeCommandParameterOption } from './Models/DeviceTypeCommandParameterOption';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceTypeCommandParameterOptionService extends WebService<IDeviceTypeCommandParameterOption> {
  URL = 'configuration/device-types';

  idDeviceType: number;
  idDeviceTypeCommand: number;
  idParameter: number;
  idOption: number;

  private get concatURL() {
    return `${this.idDeviceType}/commands/${this.idDeviceTypeCommand}/parameters/${this.idParameter}/options`;
  }

  getDeviceTypeCommandParameterOptions() {
    return super.get(this.concatURL) as Observable<IDeviceTypeCommandParameterOption[]>;
  }

  getDeviceTypeCommandParameterOption() {
    return super.get(`${this.concatURL}/${this.idOption}`) as Observable<IDeviceTypeCommandParameterOption>;
  }

  postDeviceTypeCommandParameterOption(
    option: IDeviceTypeCommandParameterOption
  ) {
    return super.post(option, this.concatURL);
  }

  deleteDeviceTypeCommandParameterOption(optionId: number) {
    return super.delete(`${this.concatURL}/${optionId}`);
  }
}
