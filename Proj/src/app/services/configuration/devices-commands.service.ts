import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IDeviceCommand } from './Models/DeviceCommand';

@Injectable()
export class DevicesCommandsService extends WebService<IDeviceCommand> {

    URL = 'configuration/logic-device-command';
    
    idLogicDeviceCommand: number;

    getDevicesCommands() {
        return super.get(`${this.idLogicDeviceCommand}/devices-commands`);
    }

    getDeviceCommand(idDeviceCommand: string | number) {
        return super.get(`${this.idLogicDeviceCommand}/devices-commands/${idDeviceCommand}`);
    }

    getDevices(idLogicDevice: number) {
        return super.get(`${this.idLogicDeviceCommand}/devices-commands/devices/${idLogicDevice}`);
    }

    deleteDeviceCommand(commandId: number) {
        return super.delete(`${this.idLogicDeviceCommand}/devices-commands/${commandId}`);
    }

    saveCommand(command: IDeviceCommand) {
        return super.post(command, `${this.idLogicDeviceCommand}/devices-commands`);
    }
}
