import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { DeviceTypeCommand } from './Models/DeviceTypeCommand';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceTypeCommandsService extends WebService<DeviceTypeCommand> {
    URL = 'configuration/device-types';
    idDeviceType: number;

    getCommands() {
        return super.get(`${this.idDeviceType}/commands`) as Observable<DeviceTypeCommand[]>;
    }

    getCommand(idDeviceTypeCommand: string | number) {
        return super.get(`${this.idDeviceType}/commands/${idDeviceTypeCommand}`) as Observable<DeviceTypeCommand>;
    }

    saveCommand(command: DeviceTypeCommand) {
        return super.post(command, `${this.idDeviceType}/commands`);
    }

    deleteCommand(commandId: number) {
        return super.delete('', `${this.idDeviceType}/commands/${commandId}`);
    }
}
