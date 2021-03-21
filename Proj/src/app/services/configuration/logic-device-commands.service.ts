import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandType } from '../commands/Models/Command';
import { WebService } from '../common/Data.service';
import { ILogicDeviceCommand } from './Models/LogicDeviceCommand';

@Injectable()
export class LogicDeviceCommandsService extends WebService<ILogicDeviceCommand | CommandType> {
    URL = 'configuration/logic-device';

    idLogicDevice: number;

    getLogicDeviceCommands() {
        return super.get(`${this.idLogicDevice}/commands`);
    }

    getLogicDeviceCommandsTypes() {
      return super.get(`${this.idLogicDevice}/commands/types`) as Observable<CommandType[]>;
  }

    getLogicDeviceCommand(idLogicDeviceCommand: string | number) {
        return super.get(`${this.idLogicDevice}/commands/${idLogicDeviceCommand}`);
    }

    saveLogicDeviceCommand(command: ILogicDeviceCommand) {
        return super.post(command, `${this.idLogicDevice}/commands`);
    }

    deleteLogicDeviceCommand(idLogicDeviceCommand: number) {
        return super.delete(`${this.idLogicDevice}/commands/${idLogicDeviceCommand}`);
    }
}
