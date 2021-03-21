import { IData } from './../../../../../services/data-query/Models/Data';
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  HostListener,
  Output,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { SubPersonalAccountDocsService } from 'src/app/services/sub-personal-account/sub-personal-account-docs.service';
import {
  AppDocument,
  IAppDocument,
} from 'src/app/services/sub-personal-account/models/app-document';
import { ICustomer } from 'src/app/services/sub-personal-account/models/Customer';
import { DocumentAttachment } from 'src/app/services/sub-personal-account/models/app-document-attachment';

@Component({
  selector: 'rom-sub-documents-card-property',
  templateUrl: './sub-documents-card-property.component.html',
  styleUrls: ['./sub-documents-card-property.component.less'],
})
export class SubDocumentsCardPropertyComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;

  private docId: number | string;
  private subscription: Subscription;
  sub$: Subscription;
  hierarchies: IData[];
  nodeTypes: any[];
  public errors: any[] = [];
  public isPropEdit = false;
  public _properties: IEntityViewProperty[];

  errorLoadEntity: any;
  isBackTwo = false;
  properties: IEntityViewProperty[];
  template: TemplateRef<any>;
  showHeaderPropertyEdit = true;
  hierarchyId: number | string;

  @Output() cancelEvent = new EventEmitter<any>();
  indexTypestring: number;

  private readonly customerConstant = 'Customer';

  private readonly documentType = 'Type';
  propCatSub$: Subscription;

  private readonly applicationConstant = 'Application';
  attachments: any = [];
  document: IAppDocument;
  prevDocId: any;

  public get isNew() {
    return this.docId === 'new';
  }

  constructor(
    private subPersonalAccountDocsService: SubPersonalAccountDocsService,
    private subPersonalAccountService: SubPersonalAccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(
      (params) => {
        this.docId = params.id;
        const state = this.router.getCurrentNavigation().extras.state;
        if (state) {
          this.prevDocId = state.documentId;
        }
        this.loadDocument();
      }
    );
  }

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.sub$);
  }

  private loadDocument() {
    this.loadingContent = true;

    this.sub$ = this.subPersonalAccountDocsService
      .get(this.prevDocId || this.docId)
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: IAppDocument) => {
          if (this.prevDocId) {
            data.Name = '';
            data.Type = null;
            this.changeProperties();
          }
          this.initProperties(data);
          if (data.Attachments && data.Attachments.length) {
            data.AttachmentNames = [AppLocalization.Files];
          }
          this.document = data;
          this.loadPropertiesFromState();
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(item: IAppDocument) {
    item.Customer = this.addCustomerName(item.Customer);
    const forView = [
      {
        Code: 'Name',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: item.Name,
      },
      {
        Code: 'DateTime',
        Name: AppLocalization.DateTime,
        Type: 'DateTime',
        Value: item.DateTime,
      },
      {
        Code: 'Application',
        Name: AppLocalization.Application,
        Type: 'String',
        Value: (item.Application || { Name: '' }).Name,
      },
      {
        Code: 'Customer',
        Name: AppLocalization.Customer,
        Type: 'String',
        Value: (item.Customer || { Surname: '' }).Surname,
      },
      {
        Code: 'Direction',
        Name: AppLocalization.Direction,
        Type: 'String',
        Value: (item.Direction || { Name: '' }).Name,
      },
      {
        Code: 'Type',
        Name: AppLocalization.DocumentType,
        Type: 'String',
        Value: (item.Type || { Name: '' }).Name,
      },
      {
        Code: 'Viewed',
        Name: AppLocalization.ViewSign,
        Type: 'Bool',
        Value: item.Viewed,
      },
      {
        Code: 'Text',
        Name: AppLocalization.Text,
        Type: 'String',
        Value: item.Text,
      },
    ];
    const optional = [
      {
        Code: 'Status',
        Name: AppLocalization.Status,
        Type: 'String',
        Value: (item.Status || { Name: '' }).Name || '',
      },
    ];
    optional.forEach((obj) => {
      if (obj.Value) {
        forView.push(obj);
      }
    });
    const forEdit = [
      {
        Code: 'Name',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: item.Name,
        IsRequired: true,
      },
      {
        Code: 'Text',
        Name: AppLocalization.Text,
        Type: 'MultiString',
        Value: item.Text,
      },
      {
        Code: this.applicationConstant,
        Name: AppLocalization.Application,
        Type: 'Option',
        Value: item.Application,
        DependProperties: [this.customerConstant, this.documentType],
        IsRequired: true,
      },
      {
        Code: this.customerConstant,
        Name: AppLocalization.Customer,
        Type: 'Option',
        Value: item.Customer,
        ParentProperties: [this.applicationConstant],
        IsRequired: true,
      },
      {
        Code: this.documentType,
        Name: AppLocalization.DocumentType,
        Type: 'Option',
        Value: item.Type,
        ParentProperties: [this.applicationConstant],
        IsRequired: true,
      },
    ];
    this.properties = this.isNew ? forEdit : forView;
  }

  @HostListener('document:keydown', ['$event']) onKeyDownFilter(
    event: KeyboardEvent
  ) {
    if (event.ctrlKey) {
      // Ctrl + s = save
      if (event.keyCode === 83) {
        event.preventDefault();
        this.saveEntity();
      }
    } else {
      if (event.keyCode === 27) {
        this.cancel();
      }
    }
  }

  ngOnInit() {
    if (this.isNew) {
      this.changeProperties();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.properties && (<SimpleChange>changes.properties).currentValue) {
      this.loadPropertiesFromState();
    }
  }

  private loadPropertiesFromState() {
    this._properties = JSON.parse(JSON.stringify(this.properties));
    this.indexTypestring = this._properties.findIndex(
      (x) => x.Type === 'String'
    );
  }

  public changeProperties() {
    this.isPropEdit = true;
  }

  public cancel() {
    this.goBack();
  }

  public saveEntity() {
    this.save(this._properties);
  }

  public eventDropDown(sender: any, prop: IEntityViewProperty) {
    if (sender.event === 'LOAD_TRIGGER') {
      try {
        this.loadArrayValues(prop);
      } catch (e) {
        (prop as any).error = e;
        (prop as any).arrayValues = [];
      }
    }
  }

  cascadePropertyChange(prop: IEntityViewProperty) {
    if (prop.DependProperties != null && prop.DependProperties.length > 0) {
      const dependencies = this._properties.filter((x) =>
        prop.DependProperties.includes(x.Code)
      );
      dependencies.forEach((dependency) => {
        if (dependency != null) {
          (dependency as any).arrayValues = null;
          (dependency as any).Value = null;
          (dependency as any).error = null;

          this.cascadePropertyChange(dependency);
        }
      });
    }
  }

  loadArrayValues(prop: IEntityViewProperty) {
    let serviceMethod: any = null;
    if ((prop as any).arrayValues == null) {
      let parentProperties: IEntityViewProperty[] = null;

      if (prop.ParentProperties != null && prop.ParentProperties.length > 0) {
        const parentProperty = this._properties.find(
          (x) => x.Code === prop.ParentProperties[0]
        );
        if (parentProperty != null) {
          if (parentProperty.Value == null) {
            throw new Error(
              AppLocalization._label_1.replace('{0}', parentProperty.Name)
            );
          }

          parentProperties = [parentProperty];
        }

        const request = {
          parentProps: parentProperties,
          prop,
        };

        const parentId = request.parentProps[0].Value.Id;
        if (prop.Code === this.customerConstant) {
          serviceMethod = this.subPersonalAccountService.get(
            `${parentId}/customers`
          );
        } else if (prop.Code === this.documentType) {
          serviceMethod = this.subPersonalAccountService.get(
            `${parentId}/document-types`
          );
        }
      } else {
        if (prop.Code === this.applicationConstant) {
          serviceMethod = this.subPersonalAccountService.get();
        }
      }
      serviceMethod.subscribe(
        (data: any[]) => {
          if (prop.Code === this.customerConstant) {
            data = data.map((cust) => this.addCustomerName(cust));
          }
          (prop as any).arrayValues = data;
        },
        (error: any) => {
          this.errors = [error];
        }
      );
    }
  }

  public save(properties: IEntityViewProperty[]) {
    this.errors = [];
    const document = new AppDocument();
    if (!this.isNew) {
      document.Id = this.docId as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      document[prop.Code] = prop.Value;
    });
    if (!document.Name) {
      this.errors = [AppLocalization.YouNeedToSetAName];
      return;
    } else if (!document.Application) {
      this.errors = [AppLocalization.YouNeedToSetTheApplication];
      return;
    } else if (!document.Customer) {
      this.errors = [AppLocalization.YouNeedToSetTheCustomer];
      return;
    } else if (!document.Type) {
      this.errors = [AppLocalization.YouNeedToSetTheDocumentType];
      return;
    }
    this.loadingContent = true;
    this.subPersonalAccountDocsService
      .postWithFiles(document, this.attachments)
      .then(() => {
        this.postPutCallback();
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  private postPutCallback() {
    this.loadingContent = false;
    this.goBack();
  }

  goBack() {
    this.router.navigate(['../../'], {
      relativeTo: this.activatedRoute,
    });
  }

  onFileUpload(files: any[]) {
    if (files.length) {
      this.attachments = files;
    }
  }

  onError(error: any[]) {
    this.errors = error;
  }

  onAnswer() {
    this.router.navigate(['../../new/property'], {
      relativeTo: this.activatedRoute,
      state: {
        documentId: this.document.Id,
      },
    });
  }

  downloadFile(files: DocumentAttachment[]) {
    const upload = (data: any) => {
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(data.blob, data.fileName);
      } else {
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(data.blob);
        downloadLink.href = url;
        downloadLink.download = data.fileName;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    this.loadingContent = true;
    this.subPersonalAccountDocsService
      .getFiles(files.map((x) => x.FilePath))
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (files) => {
          upload(files);
        },
        () => {
          this.errors = [{ ShortMessage: AppLocalization.NoFileFound }];
        }
      );
  }

  private addCustomerName(customer: ICustomer) {
    if (customer) {
      customer = {
        ...customer,
        Name: `${customer.Surname || ''} ${customer.FirstName || ''} ${
          customer.MiddleName || ''
        }`,
      } as any;
      return customer;
    }
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }
}
