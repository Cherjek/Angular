import { WebService } from './../common/Data.service';
import { Injectable } from '@angular/core';
import { OES } from './models/oes';

@Injectable()
export class OesService extends WebService<OES> {
  URL = 'tariff-calc/oeses';
}
