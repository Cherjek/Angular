import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IData } from './Models/Data';

@Injectable()
export class LogicDeviceCommandTypeService extends WebService<IData> {
    URL = 'configuration/logic-device-command-types';
}
