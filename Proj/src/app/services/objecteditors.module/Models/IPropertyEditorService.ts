import { EntityView } from "./EntityView";
import { Observable } from 'rxjs';

export interface IPropertyEditorService {
    getNew(code?: string): Observable<EntityView>;
    getEntity(idEntity: number): Observable<EntityView>;
    setNew(entity: EntityView): any;
    update(entity: EntityView): any;
}