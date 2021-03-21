import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { Management } from './Models/management';

@Injectable()
export class ManagementsMainService extends WebService<Management> {
  URL = 'commands/filters';
}
