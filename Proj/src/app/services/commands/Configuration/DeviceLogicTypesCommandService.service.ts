import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { IDeviceType } from '../../data-query';

@Injectable()
export class ConfigCommandDeviceTypesService extends WebService<IDeviceType> {
URL = 'configuration/logic-device-command-types';

}
