import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { Observable } from 'rxjs';

@Injectable()
export class DownloadFileService extends WebService<any> {

    readonly baseURL: string = 'reports/result/download';

    loadFile(id: any) {
        this.URL = this.baseURL + '/' + id;

        return super.loadBinaryData();
    }

    loadFiles(ids: string[]) {
        this.URL = this.baseURL + '/files';

        return new Observable(subsc => {
          super.post(ids)
            .then(res => {
              this.URL = this.baseURL + `/files/${res}`;
              super.loadBinaryData()
                .subscribe(_ => {
                  subsc.next(_);
                  subsc.complete();
                });
            });
        });
    }
}
