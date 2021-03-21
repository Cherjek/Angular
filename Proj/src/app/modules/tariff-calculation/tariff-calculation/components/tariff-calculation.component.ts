import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings
} from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import { Subscription } from 'rxjs';
import { GlobalValues, PermissionCheckUtils, Utils } from 'src/app/core';
import { TariffSupplier } from 'src/app/services/taiff-calculation/suppliers/Models/TariffSupplier';
import { TariffCalculationCreateService } from 'src/app/services/taiff-calculation/tariff-calculation-create/tariff-calculation-create.service';
import { IData } from 'src/app/services/configuration/Models/Data';
import { CalculationGroup } from 'src/app/services/taiff-calculation/tariff-calculation-create/Models/Group';
import { CalculationTaskParameters } from 'src/app/services/taiff-calculation/tariff-calculation-create/Models/CalculationTaskParameters';
import { TariffCalculationTemplateService } from 'src/app/services/taiff-calculation/tariff-calculation-template/tariff-calculation-template.service';
import { AppLocalization } from 'src/app/common/LocaleRes';

@Component({
  selector: 'app-tariff-calculation-create',
  templateUrl: './tariff-calculation.component.html',
  styleUrls: ['./tariff-calculation.component.scss']
})
export class TariffCalculationCreateComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public step = 1;
  public monthStart: Date | string;
  public calculationTypes: IData[];
  public calculationType: IData;
  public calculationTypesReports: IData[];
  public calculationTypesReport: IData;
  public separateLogicDevices: boolean;
  public isTypeReportsLoading: boolean;
  public IdHierarchy: number;
  public saveComplete: boolean;
  public key: string;
  public calculationGroups: CalculationGroup[];
  public name: string;
  public isShowTemplateSavePanel: boolean;
  public templateId: number;
  public template: CalculationTaskParameters;

  sub$: Subscription;
  private secStepClicked: boolean;

  constructor(
    private activeRoute: ActivatedRoute,
    private permissionCheckUtils: PermissionCheckUtils,
    private tariffCalculationCreateService: TariffCalculationCreateService,
    private tariffCalculationTemplateService: TariffCalculationTemplateService,
    private router: Router
  ) {
    this.IdHierarchy = this.activeRoute.snapshot.params.id;
    this.key = this.activeRoute.snapshot.queryParams.key;
    this.templateId = this.activeRoute.snapshot.queryParams.template;
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  private loadData() {
    this.loadingContent = true;
    this.sub$ = this.tariffCalculationCreateService
      .getCalculationTypes()
      // .pipe(
      //   finalize(() => this.loadingContent = false)
      // )
      .subscribe(
        (data: IData[]) => {         
          this.calculationTypes = data;     
          if (this.templateId) {
            this.tariffCalculationTemplateService
              .getTemplate(this.templateId)
              .subscribe((template: CalculationTaskParameters) => {
                if (template) {
                  this.template = template;
                  this.calculationType = data.find(x => x.Id === template.IdTariffCalculationType);
                  this.name = template.Name;
                  this.separateLogicDevices = template.SeparateLogicDevices;
                  this.monthStart = template.MonthDate;
                  this.selectTypeCalc(this.calculationType);
                  this.loadingContent = false;
                } else this.loadingContent = false;
              })
          } else {
            this.loadingContent = false;
          }             
        },
        (error: any) => {
          this.errors.push(error);
        }
      );
  }

  validate() {
    const errors: string[] = [];
    if (!this.monthStart) {
      errors.push(`${AppLocalization.NotSet} "${AppLocalization.TimeRange}"`);
    }
    if (!this.name) {
      errors.push(`${AppLocalization.NotSet} "${AppLocalization.Name}"`);
    }
    if (!this.calculationType) {
      errors.push(`${AppLocalization.NotSet} "${AppLocalization.TypeCalc}"`);
    }    
    if (!this.calculationTypesReport) {
      errors.push(`${AppLocalization.NotSet} "${AppLocalization.FormReport}"`);
    }
    return errors;
  }

  loadRequest() {
    const calcParams = new CalculationTaskParameters();
    calcParams.MonthDate = Utils.DateConvert.toDateTimeRequest(this.monthStart) as string;
    calcParams.Name = this.name;
    calcParams.SeparateLogicDevices = this.separateLogicDevices;
    calcParams.IdTariffCalculationType = this.calculationType.Id;
    calcParams.IdTariffCalculationTypeReport = this.calculationTypesReport.Id;    
    return calcParams;
  }

  saveTemplate(name: string) {
    const errors = this.validate();
    if (errors.length) {
      this.errors = errors;        
      return;
    }
    this.saveComplete = true;
    this.loadingContent = true;
    this.tariffCalculationTemplateService
      .saveTemplate({ Name: name, Parameters: this.loadRequest()})
      .then(() => {
        this.saveComplete = false;
        this.loadingContent = false;
        this.isShowTemplateSavePanel = false;
      })
      .catch((err) => {
        this.errors = [err]; 
        this.saveComplete = false;
        this.loadingContent = false;
      });
  }

  save() {
    const errors = this.validate();
    if (errors.length) {
      this.errors = errors;        
    } else {
      if(!this.secStepClicked) {
        this.getCalcGroup()
          .then(()=>{this.saveProcess();})
      }
      else {
        this.saveProcess();
      }
    }    
  }

  private saveProcess() {
    this.loadingContent = true;

    this.tariffCalculationCreateService
      .save(this.IdHierarchy, this.loadRequest(), this.calculationGroups)
      .then(() => this.redirectOnQueue())
      .catch((err) => { this.errors = [err]; this.loadingContent = false; });
  }

  clickNextStep() {
    if (this.step === 1) {
      const errors = this.validate();
      if (errors.length) {
        this.errors = errors;        
      } else {
        this.saveComplete = true;
        this.getCalcGroup()
          .then(()=>{
            this.saveComplete = false;
            this.step = 2;
            this.secStepClicked = true;
          })
      }      
    }
  }

  private getCalcGroup() {
    const request = {
      IdHierarchy: this.IdHierarchy,
      SeparateLogicDevices: this.separateLogicDevices,
      MonthDate: Utils.DateConvert.toDateTimeRequest(this.monthStart || new Date())
    };
    return this.tariffCalculationCreateService
      .getGroups(request, this.key)
      .then((result: CalculationGroup[]) => {
        this.calculationGroups = result;
      })
      .catch((error: any) => {
        this.errors = [error];
      });
  }

  private redirectOnQueue() {
    this.router.navigate(['tariff-calculator/main/queue']);
  }

  clickCancelButton() {
    GlobalValues.Instance.Page.backwardButton.navigate();
  }

  clickPreviousStep() {
    this.step = 1;
  }

  selectTypeCalc(item: IData) {
    this.isTypeReportsLoading = true;
    this.tariffCalculationCreateService
      .getCalculationTypeReports(item.Id)
      .pipe(
        finalize(() => this.isTypeReportsLoading = false)
      )
      .subscribe(
        (data: IData[]) => {         
          this.calculationTypesReports = data;  
          if (this.template) {
            this.calculationTypesReport = this.calculationTypesReports.find(x => x.Id === this.template.IdTariffCalculationTypeReport);
          }
        },
        (error: any) => {
          this.errors.push(error);
        }
      );
  }

  public onFileUpload(group: CalculationGroup, data: File) {
    group.File = data;
  }

  onFileUploadError(error: { ShortMessage: '' }[]) {
    this.errors = error;
  }
}
