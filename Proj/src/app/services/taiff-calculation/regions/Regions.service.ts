import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class RegionsService extends WebService<any> {
  URL = 'tariff-calc/regions';
}
