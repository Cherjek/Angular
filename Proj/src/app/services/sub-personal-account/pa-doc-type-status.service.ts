import { IData } from 'src/app/services/data-query';
import { WebService } from 'src/app/services/common/Data.service';
import { IInlineGrid } from 'src/app/services/common/Interfaces/IInlineGrid';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaDocTypeStatusService
  extends WebService<IData>
  implements IInlineGrid {
  URL = 'personal-account/applications';
  params: any;

  read() {
    return this.get(
      `${this.params.appId}/document-types/${this.params.id}/status-types`
    );
  }

  create(data: any) {
    data.idDocumentType = this.params.id;
    const url = `${this.params.appId}/document-types/${this.params.id}/status-types`;
    if (data.Id) return super.putPromise(data, url);
    return this.post(data, url);
  }

  remove(itemId: number) {
    return this.delete(
      itemId,
      `${this.params.appId}/document-types/${this.params.id}/status-types`
    );
  }
}
