import { Customer } from './models/Customer';
import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { SubPersonalAccountService } from './sub-personal-account-main.service';
import { forkJoin, Observable, of } from 'rxjs';
import { mergeMap, finalize } from 'rxjs/operators';
import { CustomerNodes } from './models/CustomerNodes';
import { ISubPersonalAccount } from './models/SubPersonalAccount';

@Injectable()
export class PaSubscriberCardService extends WebService<Customer | any> {
  URL = 'personal-account/customers';
  constructor(
    public http: HttpClient,
    private subPersonalAccountService: SubPersonalAccountService,
    public appConfig: AppConfig
  ) {
    super(http, appConfig);
  }

  activateCustomers(idSubscribers: number[]) {
    return super.putPromise(idSubscribers, `active`);
  }

  blockCustomer(idSubscribers: number[]) {
    return super.putPromise(idSubscribers, `block`);
  }

  getHierarchyNodes(id: number | string) {
    return super.get(`${id}/hierarchy-nodes`);
  }

  postHierarchyNodes(data: any, idCustomer: number | string) {
    return super.putPromise(data, `${idCustomer}/hierarchy-nodes`);
  }

  getAppsAndNodes(customerId: number | string) {
    return this.get(customerId).pipe(
      mergeMap((app) =>
        forkJoin([
          this.getHierarchyNodes(customerId),
          app && app.Application
            ? this.subPersonalAccountService.get(app.Application.Id)
            : of({}),
        ])
      )
    ) as Observable<[CustomerNodes[], ISubPersonalAccount]>;
  }
}
