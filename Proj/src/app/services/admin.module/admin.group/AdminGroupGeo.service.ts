import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { Observable } from 'rxjs';
import { GeoTree } from '../../../services/admin.module/interfaces/geo-tree';

@Injectable()
export class AdminGroupGeoService extends WebService<any | any[]> {
    readonly urlDef: string = 'admin/group';

    public getGeoPermissions(groupId: number): Observable<GeoTree[]> {
        this.URL = this.urlDef;
        return super.get(`${groupId}/geoPermissions`);
    }

    public setGeoPermissions(groupId: number, nodes: any[]) {
        this.URL = this.urlDef;
        return super.post(nodes, `${groupId}/geoPermissions`);
    }

    public getGeoTree(groupId: number): Observable<GeoTree[]> {
        this.URL = this.urlDef;
        return super.get(`${groupId}/geoTree`);
    }
}