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
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription, forkJoin } from 'rxjs';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';
import { SubPersonalAccount } from 'src/app/services/sub-personal-account/models/SubPersonalAccount';
import { GlobalValues } from 'src/app/core';
import { Chips } from 'src/app/controls/Chips/Chips';
import { AppLocalization } from 'src/app/common/LocaleRes';

@Component({
  selector: 'rom-pa-applications-card-property',
  templateUrl: './pa-applications-card-property.component.html',
  styleUrls: ['./pa-applications-card-property.component.less'],
})
export class PaApplicationsCardPropertyComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;

  private appId: number | string;
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

  @ViewChild('dropDown', { static: false }) public dropDown: any;
  @ViewChild('chipsTagsControl', { static: false })
  public chipsTagsControl: Chips;
  indexTypestring: number;

  private readonly nodeTypeConstant = 'AccountNodeType';

  private readonly availablePropCats = 'PropertyCategories';
  propCatSub$: Subscription;

  private readonly propertyTypeConstant = 'AccountPropertyType';

  private readonly hierarchyConstant = 'Hierarchy';

  private readonly accessConstant = 'AccessRequestType';
  categoriesData: any[];

  public get isNew() {
    return this.appId === 'new';
  }

  constructor(
    private subPersonalAccountService: SubPersonalAccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(
      (params) => {
        this.appId = params.id;

        this.loadApps();
      }
    );
  }

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.sub$);
  }

  private loadApps() {
    this.loadingContent = true;
    const observs = [
      this.subPersonalAccountService.get(this.appId),
      this.subPersonalAccountService.getHierarchies(),
    ];

    this.sub$ = forkJoin(observs)
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: [SubPersonalAccount, IData[]]) => {
          const appData = data[0];
          if (appData.Hierarchy) {
            this.subPersonalAccountService.hierarchyId = appData.Hierarchy.Id;
          }
          this.initProperties(appData);
          this.hierarchies = data[1];
          this.loadPropertiesFromState();
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(item: SubPersonalAccount) {
    this.properties = [
      {
        Code: 'Name',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: item.Name,
        IsRequired: true,
      },
      {
        Code: 'Code',
        Name: AppLocalization.Code,
        Type: 'String',
        Value: item.Code,
        IsRequired: true,
      },
      {
        Code: this.hierarchyConstant,
        Name: AppLocalization.Hierarchy,
        Type: 'Option',
        Value: item.Hierarchy,
        DependProperties: [this.nodeTypeConstant],
      },
      {
        Code: this.nodeTypeConstant,
        Name: AppLocalization.NodeTypeApartment,
        Type: 'Option',
        Value: item.AccountNodeType,
        ParentProperties: [this.hierarchyConstant],
        DependProperties: [this.availablePropCats, this.propertyTypeConstant],
      },
      {
        Code: 'Description',
        Name: AppLocalization.Description,
        Type: 'MultiString',
        Value: item.Description,
      },
      {
        Code: this.availablePropCats,
        Name: AppLocalization.AvailablePropCategories,
        Type: 'Chips',
        Value: item.PropertyCategories,
        ParentProperties: [this.nodeTypeConstant],
      },
      {
        Code: this.propertyTypeConstant,
        Name: AppLocalization.PropTypeLicenseNum,
        Type: 'Option',
        Value: item.AccountPropertyType,
        ParentProperties: [this.nodeTypeConstant],
      },
      {
        Code: 'CustomerRegistrationEnabled',
        Name: AppLocalization.CustomerSelfRegister,
        Type: 'Bool',
        Value: item.CustomerRegistrationEnabled,
      },
      {
        Code: this.accessConstant,
        Name: AppLocalization.CustomerSelfAccess,
        Type: 'Option',
        Value: item.AccessRequestType,
      },
    ];
    this.categoriesData = item.PropertyCategories;
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

  @HostListener('window:click', ['$event']) public onWindowClick() {
    if (this.isPropEdit && this.dropDown) {
      this.dropDown.close();
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

  private cancelChangeProperty() {
    this.isPropEdit = false;
    this.cancelEvent.emit();
  }

  private rollBackProperty() {
    this.loadPropertiesFromState();
  }

  public cancel() {
    if (this.isNew) {
      // redirect to back page
      this.back2Objects();
    } else {
      this.rollBackProperty();
      this.cancelChangeProperty();
    }
  }

  public saveEntity() {
    this.save(this._properties);
  }

  public back2Objects() {
    if (this.isNew && this.isBackTwo) {
      GlobalValues.Instance.Page.backwardButton.popLastUrl();
    }
    GlobalValues.Instance.Page.backwardButton.navigate();
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

  onSelect(prop: IEntityViewProperty) {
    if (
      prop.Code === this.nodeTypeConstant ||
      prop.Code === this.hierarchyConstant
    ) {
      this.chipsTagsControl.allChipsRemove();
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
        if (prop.Code === this.nodeTypeConstant) {
          this.subPersonalAccountService.hierarchyId = parentId;
          serviceMethod = this.subPersonalAccountService.getHierarchyNodeTypes();
        } else if (prop.Code === this.availablePropCats) {
          serviceMethod = this.subPersonalAccountService.getPropertyCategories(
            parentId
          );
        } else if (prop.Code === this.propertyTypeConstant) {
          serviceMethod = this.subPersonalAccountService.getPropertyTypes(
            parentId
          );
        }
      } else {
        if (prop.Code === this.hierarchyConstant) {
          serviceMethod = this.subPersonalAccountService.getHierarchies();
        } else if (prop.Code === this.accessConstant) {
          serviceMethod = this.subPersonalAccountService.getStatuses();
        }
      }
      serviceMethod.subscribe(
        (data: any[]) => {
          if (prop.Code === this.availablePropCats) {
            this.categoriesData = [...data];
          }
          (prop as any).arrayValues = data;
        },
        (error: any) => {
          this.errors = [error];
        }
      );
    }
  }

  getNames(values: any[]) {
    if (values && values.length) {
      return values.map((val) => val.Name);
    }
    return [];
  }

  public dropDownOpen() {
    try {
      this.dropDown.open();
    } catch (e) {}
  }

  public save(properties: IEntityViewProperty[]) {
    this.errors = [];
    const item = new SubPersonalAccount();
    if (!this.isNew) {
      item.Id = this.appId as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      if (prop.Code === this.availablePropCats) {
        prop.Value = this.categoriesData.filter((cat) =>
          this.chipsTagsControl.chips.includes(cat.Name)
        );
      }
      item[prop.Code] = prop.Value;
    });
    if (!item.Name) {
      this.errors = [AppLocalization.YouNeedToSetAName];
      return;
    } else if (!item.Code) {
      this.errors = [AppLocalization.YouNeedToSetTheCode];
      return;
    }
    this.loadingContent = true;
    this.subPersonalAccountService[this.isNew ? 'post' : 'putPromise'](item)
      .then((itemId) => {
        this.postPutCallback(itemId);
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  private postPutCallback(itemId: Object) {
    this.loadingContent = false;

    if (this.isNew) {
      this.router.navigate(['../../' + itemId], {
        relativeTo: this.activatedRoute,
      });
    } else {
      this.loadApps();
    }

    this.cancelChangeProperty();
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }
}
