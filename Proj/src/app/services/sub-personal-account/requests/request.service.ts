import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';

@Injectable()
export class RequestService extends WebService<any> {
  
  URL = 'personal-account/requests';
  
  getRequest(idRequest: number) {
    return super.get(idRequest);
  }

  getFile(file: string) {
    let params = new HttpParams();
    params = params.append('files', file);
    return super.loadBinaryData('files', params);
  }

  rejectRequest(data: any) {
    return this.post(data, 'reject');
  }

  acceptRequest(data: number[]) {
    return this.post(data, 'accept');
  }
}
