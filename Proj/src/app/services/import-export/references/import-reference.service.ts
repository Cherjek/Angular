import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class ImportReferenceService extends WebService<any> {
  URL = 'import/references';
  parse(data: any) {
    return this.post(data, '/parse');
  }
}
