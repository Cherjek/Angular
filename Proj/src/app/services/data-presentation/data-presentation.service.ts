import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/index';
import { map, delay } from 'rxjs/operators';
import { WebService } from '../common/Data.service';
import { IHierarchyNodeView } from '../additionally-hierarchies';

@Injectable({
    providedIn: 'root'
})
export class DataPresentationService extends WebService<IHierarchyNodeView> {
        
}
