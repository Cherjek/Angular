import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { GlobalValues, Utils } from 'src/app/core';
import { RequestService } from 'src/app/services/sub-personal-account/requests/request.service';

@Component({
  selector: 'app-pa-request-card-main',
  templateUrl: './pa-request-card-main.component.html',
  styleUrls: ['./pa-request-card-main.component.less'],
})
export class PaRequestCardMainComponent implements OnInit {

  errors: any = [];
  loadingContent = false;
  requestId: number;
  data$: Subscription;
  request: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private requestService: RequestService) { 
      this.requestId = activateRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContent = true;
    this.data$ = this.requestService
      .getRequest(this.requestId)
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        data => {
          this.request = data;
          if (this.request['Customer']) {
            this.request['Customer']['FIO'] = `${this.request.Customer.Surname} ${this.request.Customer.FirstName} ${this.request.Customer.MiddleName}`;
          }
          const pages = [];
          if (this.request['Application']) {
            pages.push(`${AppLocalization.Application}: ${this.request['Application']['Name']}`);
          }
          if (this.request['Status']) {
            pages.push(`${AppLocalization.Status}: ${this.request['Status']['Name']}`);
          }
          pages.push(`${AppLocalization.DateTime}: ${Utils.DateFormat.Instance.getDateTime(this.request['DateTime'])}`);
          GlobalValues.Instance.Page = { headerInfo: pages.join(', ') };
        },
        error => (this.errors = [error])
      );
  }

}
