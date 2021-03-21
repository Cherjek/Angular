import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class ExportReferenceService extends WebService<any> {
  URL = 'export/references';
}
