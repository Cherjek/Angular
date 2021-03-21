import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { HttpParams } from '@angular/common/http';

export type entitiesAttachType = 'units' | 'ld' | 'devices' | 'hierarchy';

@Injectable()
export class EntitiesFileAttachService extends WebService<any> {
  URL = 'entities-file-attach';

  _entitiesAttachType: entitiesAttachType;
  
  getAttachFiles(idEntity: number) {
    return super.get(`${this._entitiesAttachType}/addition/${idEntity}/attach`);
  }

  deleteAttachFile(idEntity: number, fileId: number) {
    return super.delete(
      fileId,
      `${this._entitiesAttachType}/addition/${idEntity}/attach`
    );
  }

  saveFile(file: File, idEntity: number) {
    const formData: FormData = new FormData();
    formData.append("files", file, file.name);
    return super.postFormData(formData, `${this._entitiesAttachType}/addition/${idEntity}/attach`)
  }

  getFile(file: string, idEntity: number) {
    let params = new HttpParams();
    params = params.append('files', file);
    return super.loadBinaryData(`${this._entitiesAttachType}/addition/${idEntity}/attach/files`, params);
  }
}
