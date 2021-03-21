import { Injectable } from '@angular/core';
import { WebService } from 'src/app/services/common/Data.service';

@Injectable()
export class TariffCalculatorMainAddService extends WebService<any> {
  URL = 'tariff-calc/main/filters';

  get(url?: string) {
    const _url = `new`;
    return super.get(url != null ? `${_url}/${url}` : _url);
  }
}
