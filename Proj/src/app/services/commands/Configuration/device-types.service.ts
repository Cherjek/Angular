import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { IData } from '../../data-query';

@Injectable()
export class DeviceTypesService extends WebService<IData> {
  URL = 'configuration/device-types';
}
