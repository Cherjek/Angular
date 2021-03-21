import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class HierarchyEditorAddFiltersService extends WebService<any> {
    URL = 'hierarchy-editor/logic-devices/filters/new';
}
