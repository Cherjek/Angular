import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription, forkJoin } from 'rxjs';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';
import {
  IAppDocumentType,
  AppDocumentType,
} from 'src/app/services/sub-personal-account/models/app-document-type';

@Component({
  selector: 'rom-app-doc-type-card-property',
  templateUrl: './app-doc-type-card-property.component.html',
  styleUrls: ['./app-doc-type-card-property.component.less'],
})
export class AppDocTypeCardPropertyComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private appId: number | string;
  private subscription: Subscription;
  sub$: Subscription;
  docId: any;
  directionTypes: any[];

  public get isNew() {
    return this.docId === 'new';
  }
  public properties: IEntityViewProperty[];

  constructor(
    private subPersonalAccountService: SubPersonalAccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(
      (params) => {
        this.appId = params.appId;
        this.docId = params.id;

        this.loadDevices();
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.sub$);
  }

  private loadDevices() {
    this.loadingContent = true;
    const observs = [
      this.subPersonalAccountService.getDocumentType(this.appId, this.docId),
      this.subPersonalAccountService.getDirectionTypes(),
    ];
    this.sub$ = forkJoin(observs)
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: [IAppDocumentType, any[]]) => {
          this.initProperties(data[0]);
          this.directionTypes = data[1];
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  optionControlDropDown(event: any) {
    const property = event.property;
    if (property.Code === 'DocumentDirectionType') {
      property.arrayValues = this.directionTypes;
    }
  }

  private initProperties(doc: IAppDocumentType) {
    this.properties = [
      {
        Code: 'Name',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: doc.Name,
        IsRequired: true,
      },
      {
        Code: 'Code',
        Name: AppLocalization.Code,
        Type: 'String',
        Value: doc.Code,
        IsRequired: true,
      },
      {
        Code: 'DocumentDirectionType',
        Name: AppLocalization.TransferDirection,
        Type: 'Option',
        Value: doc.DocumentDirectionType,
      },
    ];
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const doc = new AppDocumentType();
    if (!this.isNew) {
      doc.Id = this.docId as number;
    }
    doc.IdApplication = this.appId as number;
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      doc[prop.Code] = prop.Value;
    });
    if (!doc.Name) {
      this.errors = [AppLocalization.YouNeedToSetAName];
      return;
    } else if (!doc.Code) {
      this.errors = [AppLocalization.YouNeedToSetTheCode];
      return;
    } else if (!doc.DocumentDirectionType) {
      this.errors = [AppLocalization.TransmissionDirectionRequired];
      return;
    }
    this.loadingContent = true;
    this.subPersonalAccountService[
      this.isNew ? 'postDocumentType' : 'putDocumentType'
    ](doc, this.appId)
      .then((idDevice) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + idDevice], {
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
