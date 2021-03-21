import { Injectable } from '@angular/core';
import { WebService } from "../../common/Data.service";
import { IPropertyEditorService } from "../Models/IPropertyEditorService";
import { EntityView } from "../Models/EntityView";
import { Observable } from 'rxjs';

@Injectable()
export class LogicDeviceEditorService extends WebService<any> implements IPropertyEditorService {
    readonly URL = "logicDeviceEditor";

    getNew(): Observable<EntityView> {
        return super.get('new');
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

    saveDeviceRelate(request: any) {
        return super.post(request, 'relateDevice');
    }
}
