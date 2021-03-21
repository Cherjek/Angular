import { AppLocalization } from 'src/app/common/LocaleRes';
import { ImportExportTaskResult } from 'src/app/services/taiff-calculation/export-import-queue/Models/ImportExportTaskResult';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalValues } from 'src/app/core';
import { PuExportImportService } from 'src/app/services/property-update/filters/pu-export-import.service';
import { EntityTypeProp } from 'src/app/services/property-update/Models/EntityTypeProp';
import { BaseTaskParameters } from 'src/app/services/property-update/Models/interfaces/BaseTaskParameters';
import { HierarchyParameters } from 'src/app/services/property-update/Models/interfaces/HierarchyParameters';
import { Property } from 'src/app/services/property-update/Models/Property';
import { ExportImportSettingType } from 'src/app/services/taiff-calculation/export-import-queue/Models/ExportImportSettingType';

export const keyProperties =
  'storagePropertyUpdateExportImportCreateComponent.properties';
export const keyUnits =
  'storagePropertyUpdateExportImportCreateComponent.units';

type FormEntitiesSelect = { Id: string; Name: string; IdHierarchy?: number };
type CommonEdit = { IsPropertyEdit: boolean; Props?: Property[] };
type ObjectsFR = { IsUnitsEdit: boolean } & CommonEdit;
type LogicDevicesFR = {
  IsLogicDevicesEdit: boolean;
  IsTagsEdit: boolean;
} & CommonEdit;
type DevicesFR = {
  IsDevicesEdit: boolean;
  IsRequestEdit: boolean;
} & CommonEdit;
type HierarchyFR = { IsNodesEdit: boolean } & CommonEdit;
interface FormReactive {
  [type: string]:
    | ObjectsFR
    | LogicDevicesFR
    | DevicesFR
    | HierarchyFR
    | CommonEdit;
}
interface EntitiesTypePropsReact {
  [type: string]: Property[];
}

@Component({
  selector: 'rom-property-update-export-import-result-parameters-new',
  templateUrl:
    './property-update-export-import-result-parameters-new.component.html',
  styleUrls: [
    './property-update-export-import-result-parameters-new.component.less',
  ],
})
export class PropertyUpdateExportImportResultParametersNewComponent
  implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public exportImportData: BaseTaskParameters;
  public entitesTypeProps: EntityTypeProp[] = [];
  public saveComplete: boolean;
  public isCreateValidSuccess = false;
  public isShowTemplateSavePanel = false;
  public isValidSaveTemplate = false;

  public name: string;

  public exportImportSettingTypes: ExportImportSettingType[];
  public exportImportSettingType: ExportImportSettingType;
  public actionTypes: any[];
  public actionType: any;

  entitiesForSelect: FormEntitiesSelect[];
  entitiesSelected: FormEntitiesSelect[];
  entitiesAll: FormEntitiesSelect[];
  _entityUnits: any = {};
  taskId: number;
  subscription$: Subscription;
  private get entityUnits() {
    let units = sessionStorage.getItem(keyUnits);
    if (units != null) return JSON.parse(units);
    return undefined;
  }
  private set entityUnits(units: any) {
    if (units == null) sessionStorage.removeItem(keyUnits);
    else sessionStorage.setItem(keyUnits, JSON.stringify(units));
  }

  formReactive: FormReactive = {
    Objects: {
      IsUnitsEdit: false,
      IsPropertyEdit: false,
    },
    LogicDevices: {
      IsLogicDevicesEdit: false,
      IsPropertyEdit: false,
      IsTagsEdit: false,
    },
    Devices: {
      IsDevicesEdit: false,
      IsPropertyEdit: false,
      IsRequestEdit: false,
    },
    Tags: {
      IsPropertyEdit: false,
    },
    DeviceQueries: {
      IsPropertyEdit: false,
    },
  };

  entitiesTypePropsReact: EntitiesTypePropsReact = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private exportImportService: PuExportImportService
  ) {
    this.taskId = this.activatedRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.loadCacheForm();
    this.loadData();
  }

  ngOnDestroy() {
    GlobalValues.Instance.Page.formReactive = this.formReactive;
    GlobalValues.Instance.Page.entitiesSelected = this.entitiesSelected;
  }

  public loadCacheForm() {
    if (GlobalValues.Instance.Page.formReactive)
      this.formReactive = GlobalValues.Instance.Page.formReactive;
    if (GlobalValues.Instance.Page.entitiesSelected)
      this.entitiesSelected = GlobalValues.Instance.Page.entitiesSelected;
    this.checkUnits();
    if (!Object.keys(this._entityUnits).length && this.entityUnits != null)
      this._entityUnits = this.entityUnits;
  }

  public loadData() {
    this.loadingContent = true;
    this.subscription$ = this.exportImportService
      .getTask(this.taskId)
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (data: ImportExportTaskResult) => {
          this.exportImportData = data;
          this.name = data.Name;
          this.actionTypes = !data.IsExport
            ? [data.ImportParameters.ActionType]
            : [];
          const activeParam = !data.IsExport
            ? data.ImportParameters
            : data.ExportParameters;
          const subParamsNames = Object.keys(activeParam).filter(
            (x) => x || x != 'ActionType'
          );
          let entityTypes: any = [];

          subParamsNames.forEach((name) => {
            const param = activeParam[name];
            if (activeParam[name] && activeParam[name].EntityTypes) {
              entityTypes.push(...activeParam[name].EntityTypes);
            } else if (Array.isArray(param)) {
              param.forEach((val) => {
                entityTypes.push(...val.EntityTypes);
              });
            }
          });

          const rescursiveGroups = (propGroups: any[], parent: any) => {
            propGroups.forEach((group) => {
              if (group.PropertyGroups.length) {
                parent.PropertyTypes = (parent.PropertyTypes || []).concat(
                  group.PropertyTypes || []
                );
                rescursiveGroups(group.PropertyGroups, parent);
              } else {
                parent.PropertyTypes = (parent.PropertyTypes || []).concat(
                  group.PropertyTypes || []
                );
              }
            });
          };
          entityTypes.forEach((entity: any) => {
            rescursiveGroups(entity.PropertyGroups, entity);
          });
          this.entitiesAll = [];
          subParamsNames.forEach((paramName) => {
            if (activeParam[paramName]) {
              const paramObj = activeParam[paramName];
              let obj: any = {};
              obj.Id = paramObj.Code;
              obj.Name = paramObj.Name;
              this.entitiesAll.push(obj);
            }
          });
          this.entitiesAll = this.entitiesAll.filter((x) => x.Id);
          entityTypes
            .filter((x: any) => x.Code == 'Hierarchy')
            .forEach((entity: any, i: number) => {
              entity.TempCode = `Hierarchy-${i}`;
            });
          (activeParam.HierarchiesParameters || []).forEach(
            (x: HierarchyParameters, index: number) => {
              if (!x) {
                x = { Code: '', IdHierarchy: null, Name: '' } as any;
              }
              const code = `${x.Code}-${index}`;
              const name = AppLocalization.Hierarchy + ' ⮞ ' + x.Name;
              this.entitiesAll.push({
                Id: code,
                Name: name,
                IdHierarchy: x.IdHierarchy,
              });
              this.formReactive[code] = <HierarchyFR>{};
              (this.formReactive[code] as HierarchyFR).IsNodesEdit = false;
              (this.formReactive[code] as HierarchyFR).IsPropertyEdit = false;
            }
          );
          entityTypes.forEach((entity: any) => {
            const formKey = this.formReactive[entity.TempCode || entity.Code];
            if (formKey) {
              formKey.Props = entity.PropertyTypes;
            }
          });
          const entities: any = [];
          subParamsNames.forEach((paramName) => {
            if (activeParam[paramName]) {
              const entityTypes = activeParam[paramName].EntityTypes;
              if (entityTypes) {
                entities.push(...entityTypes);
              }
            }
          });
          this.entitesTypeProps = entities;
          let index = 0;
          this.entitesTypeProps.forEach((x) => {
            if (x.Code === 'Hierarchy') {
              this.entitiesTypePropsReact[`${x.Code}.${index++}`] =
                x.PropertyTypes;
            } else {
              this.entitiesTypePropsReact[x.Code] = x.PropertyTypes;
            }
          });
          this.entitiesSelected = [...this.entitiesAll];
        },
        (error) => (this.errors = [error])
      );
  }

  private checkUnits() {
    if (GlobalValues.Instance.Page.ComponentItems != null) {
      this.entityUnits = {
        ...this.entityUnits,
        ...GlobalValues.Instance.Page.ComponentItems,
      };
      GlobalValues.Instance.Page.ComponentItems = null;
    }
  }
}
