import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IDeviceCommandParameterOption } from './Models/DeviceCommandParameterOption';

@Injectable({
    providedIn: 'root'
})
export class DeviceCommandParameterOptionsService extends WebService<IDeviceCommandParameterOption> {

    URL = 'configuration/device-command-parameter';
    idDeviceCommandParameter: number;

    getOptions() {
        return super.get(`${this.idDeviceCommandParameter}/options`);
    }

    getOption(idDeviceCommandParameterOption: string | number) {
        return super.get(`${this.idDeviceCommandParameter}/options/${idDeviceCommandParameterOption}`);
    }

    deleteOption(idDeviceCommandParameterOption: number) {
        return super.delete(`${this.idDeviceCommandParameter}/options/${idDeviceCommandParameterOption}`);
    }

    saveOption(option: IDeviceCommandParameterOption) {
        return super.post(option, `${this.idDeviceCommandParameter}/options`);
    }
}
