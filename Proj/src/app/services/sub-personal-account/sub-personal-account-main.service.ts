import { IData } from './../data-query/Models/Data';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { ISubPersonalAccount } from './models/SubPersonalAccount';
import { IAppDocumentType } from './models/app-document-type';

@Injectable({
  providedIn: 'root',
})
export class SubPersonalAccountService extends WebService<
  ISubPersonalAccount | IData
> {
  URL = 'personal-account';
  hierarchyId: string | number;
  get(
    appId?: number | string
  ): Observable<ISubPersonalAccount | ISubPersonalAccount[]> {
    return super.get(`applications/${appId || ''}`) as Observable<
      ISubPersonalAccount | ISubPersonalAccount[]
    >;
  }

  getHierarchies() {
    return super.get('hierarchies') as Observable<IData[]>;
  }

  getHierarchyNodeTypes() {
    return super.get(`hierarchies/${this.hierarchyId}/node-types`);
  }

  getPropertyTypes(nodeId: number) {
    return super.get(
      `hierarchies/${this.hierarchyId}/node-types/${nodeId}/property-types`
    );
  }
  getPropertyCategories(nodeId: number) {
    return super.get(
      `hierarchies/${this.hierarchyId}/node-types/${nodeId}/property-categories`
    );
  }

  getStatuses() {
    return super.get('customer-statuses');
  }

  postTypesAndTags() {
    return new Promise((resolve) => {
      resolve(1);
    });
  }

  delete(id: number | string) {
    return super.delete(id, `applications`);
  }

  post(data: ISubPersonalAccount) {
    return super.post(data, `applications`);
  }

  putPromise(data: ISubPersonalAccount) {
    return super.putPromise(data, `applications`);
  }

  getLogicDeviceTypes(id: number | string) {
    return super.get(`applications/${id}/logic-device-types`);
  }

  putLogicDeviceTypes(data: any, id: number | string) {
    return super.putPromise(data, `applications/${id}/logic-device-types`);
  }

  getDocumentTypes(appId: number | string) {
    return super.get(`applications/${appId}/document-types`) as Observable<
      IAppDocumentType[]
    >;
  }

  getDocumentType(appId: number | string, docId: number | string) {
    return super.get(
      `applications/${appId}/document-types/${docId}`
    ) as Observable<IAppDocumentType>;
  }

  deleteDocumentType(appId: number | string, docId: number | string) {
    return super.delete(`applications/${appId}/document-types/${docId}`);
  }

  postDocumentType(data: IAppDocumentType, appId: number | string) {
    return super.post(data, `applications/${appId}/document-types`);
  }

  putDocumentType(data: IAppDocumentType, appId: number | string) {
    return super.putPromise(data, `applications/${appId}/document-types`);
  }

  getDirectionTypes() {
    return super.get('document-direction-types');
  }
}
