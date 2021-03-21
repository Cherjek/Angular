import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Chips } from 'src/app/controls/Chips/Chips';
import { DatePicker } from 'src/app/controls/DatePicker/DatePicker';
import { GlobalValues, Utils } from 'src/app/core';
import { DateTimeRangeType } from 'src/app/services/common/Models/DateTimeRange';
import { ExportImportService } from 'src/app/services/taiff-calculation/export-import-queue/export-import.service';
import { ExportFileFormats } from 'src/app/services/taiff-calculation/export-import-queue/Models/ExportFileFormats';
import { ExportImportSettingType } from 'src/app/services/taiff-calculation/export-import-queue/Models/ExportImportSettingType';
import { ExportTaskParameters } from 'src/app/services/taiff-calculation/export-import-queue/Models/ExportTaskParameters';
import { ImportTaskParameters } from 'src/app/services/taiff-calculation/export-import-queue/Models/ImportTaskParameters';
import { TariffImportSettingsTypes } from 'src/app/services/taiff-calculation/export-import-queue/Models/TariffImportSettingsTypes';
import { TariffSupplier } from 'src/app/services/taiff-calculation/suppliers/Models/TariffSupplier';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import * as Models from '../../../../../../services/validation.module/Models/DataValidationCreateJobSetting';

import Issue = Models.Services.ValidationModule.Models.Issue;

interface FileRequest { parameters: ImportTaskParameters | ExportTaskParameters, files: File[] }

@Component({
  selector: 'app-export-import-create',
  templateUrl: './export-import-create.component.html',
  styleUrls: ['./export-import-create.component.scss'],
})
export class ExportImportCreateComponent implements OnInit, OnDestroy {
  public typeForm: string;
  public loadingContent: boolean;
  public saveComplete: boolean;
  public errors: any[] = [];
  public dateStart: string | Date;
  public dateEnd: string | Date;
  public isCreateValidSuccess = false;
  public isShowTemplateSavePanel = false;
  public isValidSaveTemplate = false;
  public exportImportSettingTypesArr = [
    {
      Id: 1,
      Code: 'TimeRange',
      Name: AppLocalization.ListOfSettings,
      Tags: [] as ExportImportSettingType[],
    },
  ] as any;
  public JobSetting: any = {
    Issues: [],
  };
  private querySub$: any;
  private templateId: any;
  private files: File[];


  get fileFormats() {
    return Object.entries(ExportFileFormats)
      .map(([propertyKey, propertyValue]) => ({
        Id: propertyKey,
        Name: propertyValue,
      }))
      .filter((x) => !Number.isNaN(Number(x.Id)));
  }
  public fileFormat: any;

  // dictionary
  public suppliers: TariffSupplier[];
  // text chips view
  get suppliersView(): string[] {
    if (this.suppliers) {
      return this.suppliers.map((s: TariffSupplier) => s.Name);
    }
    return null;
  }
  // add from chips
  public suppliersAdd: any[];

  public name: string;

  public exportImportSettingTypes: ExportImportSettingType[];
  public exportImportSettingType: ExportImportSettingType;

  constructor(
    private exportImportService: ExportImportService,
    private suppliersService: SuppliersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.typeForm = activatedRoute.snapshot.params.type;
    this.querySub$ = this.activatedRoute.queryParamMap.subscribe(({params} : any) => {
      this.templateId = params.id
    })
    this.fileFormat = this.fileFormats[0];
  }

  @ViewChild('calendarSettings', { static: false }) calendar: DatePicker;
  @ViewChild('suppliersChips', { static: false }) suppliersChips: Chips;
  @HostListener('document:keydown', ['$event']) onKeyDownFilter(
    event: KeyboardEvent
  ) {
    if (event.ctrlKey) {
      // Ctrl + s = save
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

  ngOnInit() {
    if (this.typeForm !== 'import-files') {
      this.loadData();
    }
  }  
  
  ngOnDestroy() {
    if(this.querySub$) {
      this.querySub$.unsubscribe();
    }
  }

  public loadData() {
    this.loadingContent = true;
    forkJoin([
      this.typeForm === 'import'
        ? this.exportImportService.getImportSettings()
        : this.exportImportService.getExportSettings(),
      this.suppliersService.get(),
      this.templateId ? this.exportImportService.getTemplate(this.templateId, this.typeForm) : of(null)
    ])
    .pipe(
      finalize(() => this.loadingContent = false)
    )
    .subscribe(
      (results: [ExportImportSettingType[], TariffSupplier[], any[]]) => {
        const databaseImportExport = (results[2] as any) as ExportTaskParameters | ExportTaskParameters;
        this.exportImportSettingTypes = results[0];
        this.exportImportSettingTypesArr[0].Tags = results[0].map(
          (x: any, i) => {
            x.Id = i;
            return x;
          }
        );
        this.JobSetting = {
          Issues: this.exportImportSettingTypesArr[0].Tags.map((x: any) => ({
            ...x,
          })),
        };
        this.suppliers = results[1];
        if (databaseImportExport) {
          this.dateStart = Utils.DateConvert.toDateTimeRequest(databaseImportExport.DateTimeRange.Start);
          this.dateEnd = Utils.DateConvert.toDateTimeRequest(databaseImportExport.DateTimeRange.End);
          this.calendar.fastButtonType = databaseImportExport.DateTimeRange.RangeType;
          this.suppliersChips.chips = this.suppliers.filter(sup => databaseImportExport.IdTariffSuppliers.find(x => x === sup.Id)).map(x => x.Name);
          this.name = databaseImportExport.Name;
          this.fileFormat = this.fileFormats.find(format => (format.Id == (databaseImportExport.FileFormat as any)));
          (databaseImportExport.SettingTypes || []).forEach(type => { 
            if(type) {
              this.exportImportSettingTypesArr.forEach((x:any) => {
                (x.Tags || []).forEach((setting: any) => {
                  if(setting) {
                    if(type.Code === setting.Code) {
                      setting.IsCheck  = setting.IsSaved = true;
                    }
                  }
                })
              })
            }
          })
        };
      },
      (error) => (this.errors = [error])
    );
  }

  private saveIssue: any = {};
  public isIssueEdit(issue: any): boolean {
    return this.saveIssue[issue.Id] != null;
  }

  public getTagsChecked(issue: any): any {
    return (<any[]>(issue.Tags || [])).filter((tag) => tag.IsCheck);
  }

  public onClickedRemove(tag: any, event: any, item: any): void {
    tag.IsCheck = tag.IsSaved  = false;
    item.IsCheck = false;
  }

  public onClickedCancel(issue: any): void {
    let id = issue.Id;
    let _issue = <Issue>JSON.parse(this.saveIssue[id]);
    let findIssue = (<Issue[]>this.JobSetting.Issues).find((x) => x.Id === id);
    if (findIssue) {
      findIssue.Tags = _issue.Tags;
    }
    issue.Tags.forEach((x: any) => {
      if (x.IsCheck && !x.IsSaved) {
        x.IsCheck = false;
      } if (x.IsSaved) {
        x.IsCheck = true;
      }
    });
    this.saveIssue[id] = null;
  }

  save() {
    const request = this.prepareRequest();
    const errors = this.validateRequest(request);

    if (errors.length) {
      this.errors = errors;
      return;
    }

    this.loadingContent = true;
    this.saveComplete = true;
    
    if (request instanceof ExportTaskParameters) {
      this.exportImportService
        .saveExport(request as ExportTaskParameters)
        .then(() => this.cancel())
        .catch((err) => this.onSaveError(err))
    } else {
      let promise;
      if ((request as ImportTaskParameters).ImportType === TariffImportSettingsTypes.SiteAts) {
        promise = this.exportImportService
          .saveImport(request as ImportTaskParameters);          
      } else {
        promise = this.exportImportService
          .saveImportWithFiles(request);
      }
      promise
        .then(() => this.cancel())
        .catch((err) => this.onSaveError(err));
    }
  }

  private validateRequest(request: ImportTaskParameters | ExportTaskParameters | FileRequest) {
    const errors = [];
    if (request instanceof ImportTaskParameters || request instanceof ExportTaskParameters) {
      if (!request.Name) errors.push(AppLocalization.NoName);
      if (request.IdTariffSuppliers == null || !request.IdTariffSuppliers.length) errors.push(AppLocalization.GuaranteeingSuppliersAreNotSet);
      if (request.SettingTypes == null || !request.SettingTypes.length) errors.push(AppLocalization.SettingsNotSet);
    }
    if (request instanceof ExportTaskParameters) {
      if (!request.FileFormat) errors.push(AppLocalization.NotSelectedFormat);
    }
    if (request.hasOwnProperty('parameters')) {
      if (!request['parameters'].Name) errors.push(AppLocalization.NoName);
    }
    if (request.hasOwnProperty('files')) {
      if (request['files'] == null || request['files'].length == 0) errors.push(AppLocalization.FilesNotSelected);
    }
    return errors;
  }

  allTagsClick(item: any) {
    if (item.Indeterminate && !item.IsCheck) {
      item.Indeterminate = item.IsCheck = false;
    } else {
      item.IsCheck = !item.IsCheck;
    }

    ((<Issue>item).Tags || []).forEach(
      (tag: any) => (tag.IsCheck = item.IsCheck)
    );
  }

  clickCancelButton() {
    if (this.isShowTemplateSavePanel) {
      this.isShowTemplateSavePanel = false;
    } else {
      this.cancel();
    }
  }

  public onClickedSave(issue: any): void {
    issue.Tags.forEach((x: any) => {
      if (x.IsCheck) {
        x.IsSaved = true;
      } else {
        x.IsSaved = false;
      }
    });
    this.saveIssue[issue.Id] = null;
  }

  public onClickedAdd(issue: any): void {
    this.issueTagCheckChange(issue);
    this.saveIssue[issue.Id] = JSON.stringify(issue);
  }

  issueTagCheckChange(issue: Issue) {
    let tags = issue.Tags || [];
    let tagsCheck = (tags || []).filter((x: any) => x.IsCheck);

    (<any>issue).IsCheck = tagsCheck.length === tags.length;
    if (!(<any>issue).IsCheck) {
      (<any>issue).Indeterminate =
        tagsCheck.length > 0 && tagsCheck.length < tags.length;
    }
  }

  saveTemplate(name: any) {
    const template = {
      Name: name,
      Parameters: this.prepareRequest(),
    };

    this.exportImportService
      .saveTemplate(template as any)
      .then(() => this.clickCancelButton())
      .catch(err => this.onSaveError(err))
  }

  cancel() {
    this.saveComplete = true;
    this.loadingContent = false;
    this.router.navigate(['../../' + 'queue'], {
      relativeTo: this.activatedRoute,
    });
  }

  private prepareRequest() {
    const request: ImportTaskParameters | ExportTaskParameters =
      this.typeForm === 'import'
        ? Object.assign(new ImportTaskParameters(), {...new ImportTaskParameters(),...{ ImportType: TariffImportSettingsTypes.SiteAts }})
        : this.typeForm === 'import-files' ? Object.assign(new ImportTaskParameters(), {...new ImportTaskParameters(),...{ ImportType: TariffImportSettingsTypes.Files }})
        : new ExportTaskParameters();
    request.Name = this.name;

    if (this.typeForm !== 'import-files') {
      
      request.IdTariffSuppliers = (this.suppliers || [])
        .filter((x) => {
          if (x) {
            return (
              ((this.suppliersChips.chips as Array<string>) || []).find(
                (y) => y === x.Name
              ) != null
            );
          }
        })
        .map((x) => x.Id);
      const settings = (
        (this.exportImportSettingTypesArr[0] || {}).Tags || []
      ).filter((x: any) => x && x.IsSaved && x.IsCheck);
      request.SettingTypes = (settings || []).map((x: any) => {
        if (x) {
          return {
            Code: x.Code,
            Name: x.Name,
          };
        }
      });
      request.DateTimeRange = {
        Start: Utils.DateConvert.toDateTimeRequest(this.dateStart),
        End: Utils.DateConvert.toDateTimeRequest(this.dateEnd),
        RangeType: !this.calendar.fastButtonType ? DateTimeRangeType.None :
                      this.calendar.fastButtonType === 1 ? DateTimeRangeType.LastDay :
                          this.calendar.fastButtonType === 2 ? DateTimeRangeType.LastWeek :
                              this.calendar.fastButtonType === 3 ? DateTimeRangeType.LastThirtyDays :
                                  this.calendar.fastButtonType === 4 ? DateTimeRangeType.LastMonth : DateTimeRangeType.None
        
      } as any;
      if (request instanceof ExportTaskParameters) {
        request.FileFormat = this.fileFormat.Id;
      }

    } else {
      // file lists
      return { 
        parameters: request, 
        files: this.files
      };
    }
    return request;
  }

  private onSaveError(err: any) {
    this.loadingContent = false;
    this.saveComplete = false;
    this.errors = [err]
  }

  public onFileUpload(data: File[]) {
    this.files = data;
  }

  onFileUploadError(error: { ShortMessage: '' }[]) {
    this.errors = error;
  }
}
