import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IDeviceCommandParameter } from './Models/DeviceCommandParameter';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceCommandParametersService extends WebService<IDeviceCommandParameter> {
    URL = 'configuration/device-command';

    idDeviceCommand: number;

    getParameters() {
        return super.get(`${this.idDeviceCommand}/parameters`) as Observable<IDeviceCommandParameter[]>;
    }

    deleteParameter(idDeviceCommandParameter: number) {
        return super.delete(`${this.idDeviceCommand}/parameters/${idDeviceCommandParameter}`);
    }

    getParameter(idDeviceCommandParameter: string | number) {
        return super.get(`${this.idDeviceCommand}/parameters/${idDeviceCommandParameter}`) as Observable<IDeviceCommandParameter>;
    }

    saveParameter(param: IDeviceCommandParameter) {
        return super.post(param, `${this.idDeviceCommand}/parameters`);
    }
}
