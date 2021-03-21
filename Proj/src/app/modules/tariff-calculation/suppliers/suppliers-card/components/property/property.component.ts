import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';
import { IEntityViewProperty } from '../../../../../../services/common/Interfaces/IEntityViewProperty';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import { TariffSupplier } from 'src/app/services/taiff-calculation/suppliers/Models/TariffSupplier';
import { RegionsService } from 'src/app/services/taiff-calculation/regions/Regions.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private idSupplier: number | string;
  private subscription: Subscription;
  sub$: Subscription;

  public get isNew() {
    return this.idSupplier === 'new';
  }
  public properties: IEntityViewProperty[];
  public regions: any[];

  constructor(
    private suppliersService: SuppliersService,
    private regionsService: RegionsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(params => {
      this.idSupplier = params.id;

      this.loadData();
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.sub$);
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = forkJoin([
       this.suppliersService.get(this.idSupplier),
       this.regionsService.get()
    ])
    .pipe(
      finalize(() => {
        this.loadingContent = false;
      })
    )
    .subscribe(
      result => {
        this.initProperties(result[0] as TariffSupplier);
        this.regions = result[1];
      },
      (error: any) => {
        this.errorLoadEntity = error;
      }
    );
  }

  private initProperties(supplier: TariffSupplier) {
    this.properties = [
      {
        Code: 'Code',
        Name: AppLocalization.Code,
        Type: 'String',
        Value: supplier.Code,
        IsRequired: true
      },
      {
        Code: 'Name',
        Name: AppLocalization.Name,
        Type: 'String',
        Value: supplier.Name,
        IsRequired: true
      },
      {
        Code: 'Region',
        Name: AppLocalization.Region,
        Type: 'Option',
        Value: supplier.Region,
        IsRequired: true
      },
      {
        Code: 'NonPriceZone',
        Name: AppLocalization.NonPriceZone,
        Type: 'Bool',
        Value: supplier.NonPriceZone,
      },
    ];
  }

  optionControlDropDown(event: any) {
    if (event.control.event === 'LOAD_TRIGGER') {
      const property = event.property;
      property.arrayValues = this.regions;
    }
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const supplier = new TariffSupplier();
    if (!this.isNew) {
      supplier.Id = this.idSupplier as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      supplier[prop.Code] = prop.Value;
    });
    if (!supplier.Name) {
      this.errors = [AppLocalization.YouNeedToSetAName];
      return;
    } else if (!supplier.Code) {
      this.errors = [AppLocalization.YouNeedToSetTheCode];
      return;
    }
    this.loadingContent = true;
    this.suppliersService
      .post(supplier)
      .then(idSupplier => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + idSupplier], {
            relativeTo: this.activatedRoute
          });
        } else {
          this.loadData();
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
