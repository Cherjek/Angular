import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IDeviceType } from '../data-query';

@Injectable()
export class LogicDeviceTypesService extends WebService<IDeviceType> {
  URL = 'configuration/logic-device-types';
}
