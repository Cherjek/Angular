import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IDeviceTypeCommandParameter } from './Models/DeviceTypeCommandParameter';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceTypeCommandParameterService extends WebService<IDeviceTypeCommandParameter> {
    URL = 'configuration/device-types';

    idDeviceType: number;
    idDeviceTypeCommand: number;
    idParameter: number;

    private get concatURL() {
        return `${this.idDeviceType}/commands/${this.idDeviceTypeCommand}/parameters`;
    }

    getParameters() {
        return super.get(this.concatURL) as Observable<IDeviceTypeCommandParameter[]>;
    }

    getParameter() {
        return super.get(`${this.concatURL}/${this.idParameter}`) as Observable<IDeviceTypeCommandParameter>;
    }

    postParameter(device: IDeviceTypeCommandParameter) {
        return super.post(device, this.concatURL);
    }

    deleteParameter(parameterId: number) {
        return super.delete('', `${this.concatURL}/${parameterId}`);
    }
}
