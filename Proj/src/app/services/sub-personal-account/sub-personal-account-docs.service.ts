import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { IAppDocument } from './models/app-document';

@Injectable()
export class SubPersonalAccountDocsService extends WebService<IAppDocument> {
  URL = 'personal-account/documents';

  appId: number | string;

  get(id: number | string) {
    return super.get(id);
  }

  post(data: IAppDocument) {
    return super.post(data);
  }

  getFiles(files: string[]) {
    let params = new HttpParams();
    for (let file of files) {
      params = params.append('files', file);
    }
    return super.loadBinaryData('files', params);
  }

  postWithFiles(data: any, files: File[]) {
    const formData: FormData = new FormData();
    if (files && files.length) {
      files.forEach((file) => {
        formData.append('files', file, file.name);
      });
    }
    formData.append('document', JSON.stringify(data));
    return super.postFormData(formData);
  }
}
