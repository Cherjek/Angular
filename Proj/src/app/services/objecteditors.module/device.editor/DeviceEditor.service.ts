import { Injectable } from '@angular/core';
import { WebService } from "../../common/Data.service";
import { IPropertyEditorService } from "../Models/IPropertyEditorService";
import { EntityView } from "../Models/EntityView";
import { Observable } from 'rxjs';

@Injectable()
export class DeviceEditorService extends WebService<any> implements IPropertyEditorService {
    readonly URL = "deviceEditor";

    getNew(devicecode: string): Observable<EntityView> {
        return super.get(`new/${devicecode}`);
    }

    getEntity(idEntity: number): Observable<EntityView> {
        return super.get(idEntity);
    }

    setNew(entity: EntityView) {
        return super.post(entity, 'new');
    }

    update(entity: EntityView) {
        return super.post(entity, 'update');
    }
}
