import { ToggleSwitch } from './../../../../../controls/ToggleSwitch/ToggleSwitch';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { TariffHistoryService } from 'src/app/services/tariff-calculator/tariff-history.service';
import { LogicDeviceTariffHistory } from 'src/app/services/tariff-calculator/models/logic-device-tariff-history';
import { TariffCalcService } from 'src/app/services/tariff-calculator/tariff-calc.service';
import { MaximumPowerService } from 'src/app/services/tariff-calculator/maximum-power.service';
import { PowerLevelService } from 'src/app/services/tariff-calculator/power-levels.service';
import { AgreementTypesService } from 'src/app/services/tariff-calculator/agreement-types.service';
import { Utils } from 'src/app/core';

const PC6 = 'PC6';
const PC4 = 'PC4';
@Component({
  selector: 'rom-logic-device-tariff-history-card-property',
  templateUrl: './logic-device-tariff-history-card-property.component.html',
  styleUrls: ['./logic-device-tariff-history-card-property.component.less'],
  providers: [
    TariffCalcService,
    MaximumPowerService,
    PowerLevelService,
    AgreementTypesService,
  ],
})
export class LogicDeviceTariffHistoryCardPropertyComponent
  implements OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;

  private historyId: number | string;
  private subscription: Subscription;
  private sub$: Subscription;
  private propSub$: Subscription;
  priceCatOriginal: any[];
  priceCat$: Subscription;

  public get isNew() {
    return this.historyId === 'new';
  }
  public properties: IEntityViewProperty[];
  @ViewChild('propControl', { static: false }) propControl: any;

  constructor(
    private tariffHistoryService: TariffHistoryService,
    private maxPowerService: MaximumPowerService,
    private powerLevelService: PowerLevelService,
    private tariffCalcService: TariffCalcService,
    private agreementTypesService: AgreementTypesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe((param) => {
      this.historyId = param.id;
      this.tariffHistoryService.idLogicDevice = param.logicDeviceId;
      this.tariffHistoryService.idLogicDeviceHistory = param.id;

      this.loadData();
    });
  }

  ngOnDestroy() {
    this.unsubscriber([
      this.subscription,
      this.sub$,
      this.propSub$,
      this.priceCat$,
    ]);
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = this.tariffHistoryService
      .getLogicDeviceHistory()
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: LogicDeviceTariffHistory) => {
          if (this.isNew) [(data.StartDate = null)];
          this.initProperties(data);
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(history: LogicDeviceTariffHistory) {
    this.properties = [
      {
        Code: 'StartDate',
        Name: AppLocalization.SettingsStartDate,
        Type: 'Date',
        Value: Utils.DateFormat.Instance.getDate(history.StartDate),
        IsRequired: true,
      },
      {
        Code: 'Supplier',
        Name: AppLocalization.GuaranteeingSupplier,
        Type: 'Option',
        Value: history.Supplier,
        IsRequired: true,
      },
      {
        Code: 'MaxPowerType',
        Name: AppLocalization.MaximumPower,
        Type: 'Option',
        Value: history.MaxPowerType,
        IsRequired: true,
      },
      {
        Code: 'PowerLevelType',
        Name: AppLocalization.VoltageLevel,
        Type: 'Option',
        Value: history.PowerLevelType,
        IsRequired: true,
      },
      {
        Code: 'AgreementType',
        Name: AppLocalization.AgreementType,
        Type: 'Option',
        Value: history.AgreementType,
        IsRequired: true,
      },
      {
        Code: 'SupplyOrganizationType',
        Name: AppLocalization.SupplyOrganizationType,
        Type: 'Option',
        Value: history.SupplyOrganizationType,
        IsRequired: true,
      },
      {
        Code: 'IsGenerator',
        Name: AppLocalization.GeneratorVoltage,
        Type: 'Bool',
        Value: history.IsGenerator,
      },
      {
        Code: 'PriceCategoryType',
        Name: AppLocalization.PriceCategory,
        Type: 'Option',
        Value: history.PriceCategoryType,
        IsRequired: true,
      },
    ];
  }

  optionControlDropDown(event: any) {
    this.errors = [];
    if (event.control.event === 'LOAD_TRIGGER') {
      switch (event.property.Code) {
        case 'Supplier':
          this.populatePropArray(this.tariffCalcService.getSuppliers(), event.property);
          return;
        case 'MaxPowerType':
          this.populatePropArray(this.maxPowerService.read(), event.property);
          return;
        case 'PowerLevelType':
          this.populatePropArray(this.powerLevelService.read(), event.property);
          return;
        case 'AgreementType':
          this.populatePropArray(this.agreementTypesService.read(), event.property);
          return;
        case 'SupplyOrganizationType': {
          console.log('load SupplyOrganizationType: ' + (event.property.arrayValues || []).length);
          this.populatePropArray(this.tariffCalcService.getSupplyOrgs(), event.property);
          return;
        }
        case 'PriceCategoryType': {
          if (event.property.arrayValues == null) {
            this.loadPriceCat();
          }          
          return;
        }
        default:
          break;
      }
    } else {
      switch (event.property.Code) {
        case 'SupplyOrganizationType': {
          this.loadPriceCat();
          break;
        }
      }
      
    }   
  }

  private loadPriceCat() {
    const props = this.propControl._properties as IEntityViewProperty[];
    const supOrgType = props.find(
      (x: any) => x.Code === 'SupplyOrganizationType'
    );
    if (!supOrgType.Value) {
      return;
    }
    this.tariffCalcService.idSupplyOrgType = (
      (supOrgType || {} as IEntityViewProperty).Value || {}
    ).Id;
    this.tariffCalcService.getPriceCategories()
        .subscribe(
          (data) => {
            this.priceCatOriginal = data;
            const priceCats = this.filterPriceCategories(data);      
            this.updatePriceCat(priceCats);  
          },
          (error) => {
            this.errors = [error];
          }
        );
  }

  private updatePriceCat(priceCats: any[]) {
    const props = this.propControl._properties as IEntityViewProperty[];
    const priceCat = props.find((x) => x.Code === 'PriceCategoryType');
    const clonePriceCat = {...priceCat};
    clonePriceCat.arrayValues = priceCats;
    let code: string;
    if (clonePriceCat.Value != null) {
      code = clonePriceCat.Value.Code;
      clonePriceCat.Value = priceCats.find(x => x.Code === code);      
    }
    const index = props.findIndex(x => x.Code === 'PriceCategoryType');
    if (index >= 0) {
      props[index] = clonePriceCat;
    }
  }

  onPropChange(data: { element: any; event: any }) {
    if (data && data.element instanceof ToggleSwitch) {
      const props = this.propControl._properties as IEntityViewProperty[];
      const priceCats = this.filterPriceCategories(this.priceCatOriginal);      
      this.updatePriceCat(priceCats);  
    }
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    let errorFound = false;
    this.errors = [];
    const history = new LogicDeviceTariffHistory();
    if (!this.isNew) {
      history.Id = this.historyId as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      if (typeof prop.Value === 'string') {
        prop.Value = prop.Value.trim();
      }
      if (prop.IsRequired && !prop.Value) {
        this.errors = [`${AppLocalization.Label12} "` + prop.Name + '"'];
        errorFound = true;
        return;
      }
      history[prop.Code] = prop.Value;
    });
    if (errorFound) return;

    history.StartDate = Utils.DateConvert.toDateTimeRequest(history.StartDate);
    this.loadingContent = true;
    this.tariffHistoryService
      .saveLogicDeviceHistory(history)
      .then((historyId) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../' + historyId], {
            relativeTo: this.activatedRoute,
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

  filterPriceCategories(priceCats: any[]) {
    const props = this.propControl._properties as IEntityViewProperty[];
    const gen = props.find((prop) => prop.Code === 'IsGenerator');
    const priceCat = props.find((x) => x.Code === 'PriceCategoryType');
    if (gen && gen.Value) {
      return priceCats.filter(
        (x) => x.Code === PC4 || x.Code === PC6
      );
    } else {
      return priceCats;
    }
  }

  private populatePropArray(getMethod: Observable<any>, property: IEntityViewProperty) {
    this.propSub$ = getMethod.subscribe(
      (data) => property.arrayValues = data,
      (error) => {
        this.errors = [error];
      }
    );
  }

  private unsubscriber(subs: Subscription[]) {
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
