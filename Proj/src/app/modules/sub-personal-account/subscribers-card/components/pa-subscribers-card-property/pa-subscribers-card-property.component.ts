import { SubPersonalAccountService } from './../../../../../services/sub-personal-account/sub-personal-account-main.service';
import { Customer } from './../../../../../services/sub-personal-account/models/Customer';
import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription, forkJoin } from 'rxjs';
import { IData } from 'src/app/services/data-query';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { PaSubscriberCardService } from 'src/app/services/sub-personal-account/pa-subscriber-card.service';
import { ISubPersonalAccount } from 'src/app/services/sub-personal-account/models/SubPersonalAccount';
import { AppLocalization } from 'src/app/common/LocaleRes';

@Component({
  selector: 'rom-pa-subscribers-card-property',
  templateUrl: './pa-subscribers-card-property.component.html',
  styleUrls: ['./pa-subscribers-card-property.component.less'],
})
export class PaSubscribersCardPropertyComponent implements OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private customerId: number | string;
  private subscription: Subscription;
  private applications: ISubPersonalAccount[];
  private statuses: IData[];
  sub$: Subscription;

  public get isNew() {
    return this.customerId === 'new';
  }
  public properties: IEntityViewProperty[];

  constructor(
    private paSubCardService: PaSubscriberCardService,
    private subPersonalAccountService: SubPersonalAccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(
      (params) => {
        this.customerId = params.id;

        this.loadDevices();
      }
    );
  }

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.sub$);
  }

  private loadDevices() {
    this.loadingContent = true;
    const observs = [
      this.paSubCardService.get(this.customerId),
      this.subPersonalAccountService.get(),
      this.subPersonalAccountService.getStatuses(),
    ];
    this.sub$ = forkJoin(observs)
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: [Customer, ISubPersonalAccount[], IData[]]) => {
          this.initProperties(data[0]);
          this.applications = data[1];
          this.statuses = data[2];
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(customer: Customer) {
    this.properties = [
      {
        Code: 'FirstName',
        Name: AppLocalization.PersonName,
        Type: 'String',
        Value: customer.FirstName,
        IsRequired: true,
      },
      {
        Code: 'Surname',
        Name: AppLocalization.Surname,
        Type: 'String',
        Value: customer.Surname,
        IsRequired: true,
      },
      {
        Code: 'MiddleName',
        Name: AppLocalization.MiddleName,
        Type: 'String',
        Value: customer.MiddleName,
      },
      {
        Code: 'Password',
        Name: AppLocalization.Password,
        Type: 'String',
        Value: customer.Password,
      },
      {
        Code: 'PhoneNumber',
        Name: AppLocalization.Phone,
        Type: 'String',
        Value: customer.PhoneNumber,
      },
      {
        Code: 'Email',
        Name: AppLocalization.Email,
        Type: 'String',
        Value: customer.Email,
      },
      {
        Code: 'Address',
        Name: AppLocalization.Address,
        Type: 'String',
        Value: customer.Address,
      },
      {
        Code: 'Application',
        Name: AppLocalization.Application,
        Type: 'Option',
        Value: customer.Application,
        IsRequired: true,
      },
      {
        Code: 'Status',
        Name: AppLocalization.Status,
        Type: 'Option',
        Value: customer.Status,
      },
      {
        Code: 'Comment',
        Name: AppLocalization.Commentary,
        Type: 'MultiString',
        Value: customer.Comment,
      },
    ];
  }

  optionControlDropDown(event: any) {
    const property = event.property;
    if (property.Code === 'Application') {
      property.arrayValues = this.applications;
    } else if (property.Code === 'Status') {
      property.arrayValues = this.statuses;
    }
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const customer = new Customer();
    if (!this.isNew) {
      customer.Id = this.customerId as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      customer[prop.Code] = prop.Value;
    });
    if (!customer.FirstName) {
      this.errors = [AppLocalization.NameRequired];
      return;
    } else if (!customer.Surname) {
      this.errors = [AppLocalization.SurnameRequired];
      return;
    } else if (!customer.Application) {
      this.errors = [AppLocalization.ApplicationRequired];
      return;
    } else if (!customer.Status) {
      this.errors = [AppLocalization.StatusRequired];
      return;
    }
    this.loadingContent = true;
    this.paSubCardService[this.isNew ? 'post' : 'putPromise'](customer)
      .then((idCustomer) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + idCustomer], {
            relativeTo: this.activatedRoute,
          });
        } else {
          this.loadDevices();
        }

        propControl.cancelChangeProperty();
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }
}
