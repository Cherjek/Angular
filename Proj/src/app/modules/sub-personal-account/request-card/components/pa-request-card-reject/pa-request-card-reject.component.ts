import { IEntityViewProperty } from './../../../../../services/common/Interfaces/IEntityViewProperty';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/services/sub-personal-account/requests/request.service';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rom-pa-request-card-reject',
  templateUrl: './pa-request-card-reject.component.html',
  styleUrls: ['./pa-request-card-reject.component.less'],
})
export class PaRequestCardRejectComponent implements OnInit {
  public errors: any[] = [];
  public loadingContent = false;
  public isPropEdit = false;
  errorLoadEntity: any;
  properties: IEntityViewProperty[];

  private requestId: number | string;
  private subscription: Subscription;
  sub$: Subscription;
  commentValue: string;

  @HostListener('document:keydown', ['$event']) onKeyDownFilter(
    event: KeyboardEvent
  ) {
    if (event.ctrlKey) {
      if (event.keyCode === 83) {
        event.preventDefault();
        this.save();
      }
    } else {
      if (event.keyCode === 27) {
        this.cancel();
      }
    }
  }

  constructor(
    private requestService: RequestService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(
      (params) => {
        this.requestId = params.id;
        this.initProperties();
      }
    );
  }

  ngOnInit() {
    this.isPropEdit = true;
  }

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.sub$);
  }

  private initProperties() {
    this.properties = [
      {
        Code: 'Comment',
        Name: AppLocalization.RejectReason,
        Type: 'MultiString',
        Value: this.commentValue,
        IsRequired: true,
      },
    ];
  }

  public save() {
    this.errors = [];
    const obj: any = {};
    obj.idRequests = [this.requestId] as number[];
    this.properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      obj[prop.Code] = prop.Value;
    });
    if (!obj.Comment) {
      this.errors = [AppLocalization.RejectReasonStatement];
      return;
    }
    this.loadingContent = true;
    this.requestService
      .rejectRequest(obj)
      .then(() => {
        this.goToList();
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

  public cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['../../../request'], {
      relativeTo: this.activatedRoute,
    });
  }
}
