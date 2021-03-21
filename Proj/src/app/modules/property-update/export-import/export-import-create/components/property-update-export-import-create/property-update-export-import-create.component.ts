import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalValues } from 'src/app/core';
import { PropertyUpdateEntityTypesService } from 'src/app/services/property-update/entity/property-update-entity-types.service';
import { EntityType } from 'src/app/services/property-update/Models/EntityType';
import { EntityTypeProp } from 'src/app/services/property-update/Models/EntityTypeProp';
import { BaseTaskParameters } from 'src/app/services/property-update/Models/interfaces/BaseTaskParameters';
import { DevicesParameters } from 'src/app/services/property-update/Models/interfaces/DevicesParameters';
import { EntityGroupParameters } from 'src/app/services/property-update/Models/interfaces/EntityGroupParameters';
import { HierarchyParameters } from 'src/app/services/property-update/Models/interfaces/HierarchyParameters';
import { LogicDevicesParameters } from 'src/app/services/property-update/Models/interfaces/LogicDevicesParameters';
import { ObjectsParameters } from 'src/app/services/property-update/Models/interfaces/ObjectsParameters';
import { Property } from 'src/app/services/property-update/Models/Property';
import { PropertyGroup } from 'src/app/services/property-update/Models/PropertyGroup';
import { ExportImportSettingType } from 'src/app/services/taiff-calculation/export-import-queue/Models/ExportImportSettingType';

export const keyProperties = 'storagePropertyUpdateExportImportCreateComponent.properties';
export const keyUnits = 'storagePropertyUpdateExportImportCreateComponent.units';

type FormEntitiesSelect = { Id: string, Name: string; IdHierarchy?: number };
type CommonEdit = { IsPropertyEdit: boolean; Props?: Property[] };
type ObjectsFR = { IsUnitsEdit: boolean; } & CommonEdit;
type LogicDevicesFR = { IsLogicDevicesEdit: boolean; IsTagsEdit: boolean; }  & CommonEdit;
type DevicesFR = { IsDevicesEdit: boolean; IsRequestEdit: boolean; }  & CommonEdit; 
type HierarchyFR = { IsNodesEdit: boolean; } & CommonEdit;
type EntitiesFR = 'Objects' | 'LogicDevices' | 'Devices';
interface FormReactive {
  [type: string]: ObjectsFR | LogicDevicesFR | DevicesFR | HierarchyFR | CommonEdit;
};
interface EntitiesTypePropsReact {
  [type: string]: Property[];
} 

@Component({
  selector: 'rom-property-update-export-import-create',
  templateUrl: './property-update-export-import-create.component.html',
  styleUrls: ['./property-update-export-import-create.component.less']
})
export class PropertyUpdateExportImportCreateComponent
  implements OnInit, OnDestroy {
  public typeForm: string;
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
  private files: File[];

  entitiesForSelect: FormEntitiesSelect[];
  entitiesSelected: FormEntitiesSelect[];
  entitiesAll: FormEntitiesSelect[];

  // private get entityProperties() {
  //   let properties = sessionStorage.getItem(keyProperties);
  //   if (properties != null) return JSON.parse(properties);
  //   return undefined;
  // }
  // private set entityProperties(properties: any) {
  //   if (properties == null) sessionStorage.removeItem(keyProperties);
  //   else sessionStorage.setItem(keyProperties, JSON.stringify(properties));
  // }
  _entityUnits: any = {};
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
      IsPropertyEdit: false
    },
    LogicDevices: {
      IsLogicDevicesEdit: false,
      IsPropertyEdit: false,
      IsTagsEdit: false
    },
    Devices: {
      IsDevicesEdit: false,
      IsPropertyEdit: false,
      IsRequestEdit: false
    },    
    Tags: {
      IsPropertyEdit: false
    },
    DeviceQueries: {
      IsPropertyEdit: false
    }
  };

  entitiesTypePropsReact: EntitiesTypePropsReact = {};

  constructor(
    private propUpdateEntityTypesService: PropertyUpdateEntityTypesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.typeForm = this.activatedRoute.snapshot.params.type;
  }

  ngOnInit() {
    this.loadCacheForm();
    this.loadData();
  }

  ngOnDestroy() {
    //this.entityUnits = null;
    //this.entityProperties = null;
    GlobalValues.Instance.Page.formReactive = this.formReactive;
    GlobalValues.Instance.Page.entitiesSelected = this.entitiesSelected;
    GlobalValues.Instance.Page.name = this.name;
    GlobalValues.Instance.Page.actionType = this.actionType;
  }

  public loadCacheForm() {
    if (GlobalValues.Instance.Page.formReactive) this.formReactive = GlobalValues.Instance.Page.formReactive;
    if (GlobalValues.Instance.Page.entitiesSelected) this.entitiesSelected = GlobalValues.Instance.Page.entitiesSelected;
    if (GlobalValues.Instance.Page.name) this.name = GlobalValues.Instance.Page.name;
    if (GlobalValues.Instance.Page.actionType) this.actionType = GlobalValues.Instance.Page.actionType;
    this.checkUnits();
    if (!Object.keys(this._entityUnits).length && this.entityUnits != null) this._entityUnits = this.entityUnits;
  }

  public loadData() {
    this.loadingContent = true;
    forkJoin([
      this.propUpdateEntityTypesService.getParameters(),
      this.propUpdateEntityTypesService.getActionTypes(),
      this.propUpdateEntityTypesService.getEntitiesProps(),
    ])    
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (data: [BaseTaskParameters, any[], EntityTypeProp[]]) => {
          this.exportImportData = data[0];
          this.actionTypes = data[1];
          
          this.entitiesAll = [
            {
              Id: this.exportImportData.ObjectsParameters.Code,
              Name: this.exportImportData.ObjectsParameters.Name
            },
            {
              Id: this.exportImportData.LogicDevicesParameters.Code,
              Name: this.exportImportData.LogicDevicesParameters.Name
            },
            {
              Id: this.exportImportData.DevicesParameters.Code,
              Name: this.exportImportData.DevicesParameters.Name
            }
          ];
          (this.exportImportData.HierarchiesParameters || []).forEach((x: HierarchyParameters, index) => {
            const code = `${x.Code}_${index}`;
            const name = AppLocalization.Hierarchy + ' ⮞ ' + x.Name;
            this.entitiesAll.push({
              Id: code,
              Name: name,
              IdHierarchy: x.IdHierarchy
            });
            this.formReactive[code] = this.formReactive[code] || <HierarchyFR>{};
            (this.formReactive[code] as HierarchyFR).IsNodesEdit = false;
            (this.formReactive[code] as HierarchyFR).IsPropertyEdit = false;
            if (GlobalValues.Instance.Page.Template != null) {              
              // load from template
              if (GlobalValues.Instance.Page.Template.entitiesSelected != null) {
                const entTemp = GlobalValues.Instance.Page.Template.entitiesSelected.find((e: any) => e.Id === `${x.Code}.${x.IdHierarchy}`);
                if (entTemp) {
                  entTemp.Id = code;
                }
              }
              if (GlobalValues.Instance.Page.Template.formReactive != null) {
                const formTemp = GlobalValues.Instance.Page.Template.formReactive[`${x.Code}.${x.IdHierarchy}`];
                if (formTemp && formTemp.Props != null) {                  
                  this.formReactive[code].Props = formTemp.Props.map((x: any) => ({...x}));
                }
                if (formTemp && formTemp.entities != null) {                  
                  this._entityUnits[code] = formTemp.entities;
                  this.entityUnits = this._entityUnits;
                }
              }              
            }            
          });
          if (GlobalValues.Instance.Page.Template != null) {
            this.entitiesSelected = GlobalValues.Instance.Page.Template.entitiesSelected;
            if (GlobalValues.Instance.Page.Template.formReactive != null) {
              Object.keys(GlobalValues.Instance.Page.Template.formReactive)
                .forEach(key => {
                  const fr = GlobalValues.Instance.Page.Template.formReactive[key];
                  if (this.formReactive[key] && fr) {
                    this.formReactive[key].Props = fr.Props;
                    if (fr.entities) {
                      this._entityUnits[key] = fr.entities;
                      this.entityUnits = this._entityUnits;
                    }
                  }                  
                });
            }
            this.name = GlobalValues.Instance.Page.Template.Name;
            this.actionType = GlobalValues.Instance.Page.Template.ActionType;
            GlobalValues.Instance.Page.Template = null;
          }
          this.filterEntitesDropDown();

          this.entitesTypeProps = data[2];
          let index = 0;
          this.entitesTypeProps.forEach((x) => {            
            if (x.Code === 'Hierarchy') {
              this.entitiesTypePropsReact[`${x.Code}_${index++}`] = x.PropertyTypes;
            } else {
              this.entitiesTypePropsReact[x.Code] = x.PropertyTypes;
            }            
          });          
        },
        (error) => (this.errors = [error])
      );
  }

  private filterEntitesDropDown() {
    const results = (this.entitiesAll || []).filter(x => (this.entitiesSelected || []).find(y => y.Id === x.Id) == null);
    this.entitiesForSelect = results;
  }

  addFormEntites(formEntities: FormEntitiesSelect[]) {
    this.entitiesSelected = [...(this.entitiesSelected || []), ...formEntities];
    this.filterEntitesDropDown();
  }

  removeFormEntites(formEntity: FormEntitiesSelect) {
    const index = this.entitiesSelected.findIndex(x => x.Id === formEntity.Id);
    this.entitiesSelected.splice(index, 1);
    this.filterEntitesDropDown();
  }

  // private checkProperties() {
  //   if (GlobalValues.Instance.Page.PropertyTreeComponentNodes != null) {
  //     this.entityProperties = {
  //       ...this.entityProperties,
  //       ...GlobalValues.Instance.Page.PropertyTreeComponentNodes,
  //     };
  //     GlobalValues.Instance.Page.PropertyTreeComponentNodes = null;
  //   }
  // }
  private checkUnits() {
    if (GlobalValues.Instance.Page.ComponentItems != null) {
      this.entityUnits = {
        ...this.entityUnits,
        ...GlobalValues.Instance.Page.ComponentItems,
      };
      GlobalValues.Instance.Page.ComponentItems = null;
    }
  }

  public onClickedAddEntities(data: FormEntitiesSelect): void {
    if (data.IdHierarchy != null) {
      this.router.navigate([`property-update/export-import/add-entities/${data.Id}`], { queryParams: { idHierarchy: data.IdHierarchy } });
    } else {
      this.router.navigate([`property-update/export-import/add-entities/${data.Id}`]);
    }
  }

  saveTemplate(name: any) {
    const template = {
      Name: name,
      Parameters: this.prepareRequest(),
    };

    this.loadingContent = true;
    this.saveComplete = true;
    this.propUpdateEntityTypesService
      .saveTemplate(template as any, this.typeForm)
      .then(() => this.cancel())
      .catch(err => { this.errors = [err]; this.saveComplete = false; });
  }

  prepareRequest() {
    const checkProperty = (props: Property[], checkProps: Property[]) => {
      (props || []).forEach(prop => prop.IsActive = false);
      (checkProps || []).forEach(chp => {
        const pf = props.find(p => p.Code === chp.Code);
        if (pf != null) {
          pf.IsActive = true;
        }
      });
    }
    const checkPropertyGroup = (propGroups: PropertyGroup[], checkProps: Property[]) => {
      (propGroups || []).forEach(pg => {
        checkPropertyGroup(pg.PropertyGroups, checkProps);
        checkProperty(pg.PropertyTypes, checkProps);
      });
    }    

    const request: BaseTaskParameters = {
      Name: this.name
    };
    if (this.typeForm === 'import') {
      request['ActionType'] = this.actionType;
    }

    const updateParams = (params: EntityGroupParameters, element: any) => {
      params.Code = element.Id;
      params.Name = element.Name;
      params.EntityTypes.forEach(entity => {
        checkProperty(entity.PropertyTypes, ((this.formReactive[entity.Code] || {}) as any).Props);
        checkPropertyGroup(entity.PropertyGroups, ((this.formReactive[entity.Code] || {}) as any).Props);
      }); 
    }
    (this.entitiesSelected || []).forEach((element: FormEntitiesSelect) => {
      if (element.Id === 'Objects') {
        request.ObjectsParameters = <ObjectsParameters>{};
        request.ObjectsParameters.IdObjects = (this._entityUnits[element.Id] || []).map((x: any) => x.Id);
        request.ObjectsParameters.EntityTypes = this.exportImportData.ObjectsParameters.EntityTypes;
        updateParams(request.ObjectsParameters, element);       
      } else if (element.Id === 'Devices') {
        request.DevicesParameters = <DevicesParameters>{};
        request.DevicesParameters.IdDevices = (this._entityUnits[element.Id] || []).map((x: any) => x.Id);
        request.DevicesParameters.EntityTypes = this.exportImportData.DevicesParameters.EntityTypes;
        updateParams(request.DevicesParameters, element); 
      } else if (element.Id === 'LogicDevices') {
        request.LogicDevicesParameters = <LogicDevicesParameters>{};
        request.LogicDevicesParameters.IdLogicDevices = (this._entityUnits[element.Id] || []).map((x: any) => x.Id);
        request.LogicDevicesParameters.EntityTypes = this.exportImportData.LogicDevicesParameters.EntityTypes;
        updateParams(request.LogicDevicesParameters, element); 
      } else {
        request.HierarchiesParameters = request.HierarchiesParameters || [];
        const params = <HierarchyParameters>{};
        params.IdHierarchy = element.IdHierarchy;
        params.IdNodes = (this._entityUnits[element.Id] || []).map((x: any) => x.Id);
        
        const hierarchy = this.exportImportData.HierarchiesParameters.find(x => x.IdHierarchy === element.IdHierarchy);
        if (hierarchy != null) {
          params.EntityTypes = hierarchy.EntityTypes;
          params.Code = hierarchy.Code;
          params.Name = hierarchy.Name;
          params.EntityTypes.forEach(entity => {
            checkProperty(entity.PropertyTypes, ((this.formReactive[element.Id] || {}) as any).Props);
            checkPropertyGroup(entity.PropertyGroups, ((this.formReactive[element.Id] || {}) as any).Props);
          });
        }
        request.HierarchiesParameters.push(params);
      }
    });
    return request;
  }

  save() {

    const request = this.prepareRequest();    
    if (Object.keys(request).length === 1 && Object.keys(request)[0] === 'Name') {
      this.errors = [AppLocalization.NotChooseValue];
      return;
    }
    this.loadingContent = true;
    this.saveComplete = true;
    let promise;
    if (this.typeForm === 'export') {
      promise = this.propUpdateEntityTypesService.save({ Parameters: request });
    } else {
      promise = this.propUpdateEntityTypesService.saveImportWithFiles({ Parameters: request }, this.files); 
    }    
    promise.then(() => this.cancel())
      .catch((err) => {
        this.loadingContent = false;
        this.saveComplete = false;
        this.errors = [err];
      });
  }

  cancel() {    
    this.loadingContent = false;
    if (!this.isShowTemplateSavePanel) {     
      this.saveComplete = true; 
      GlobalValues.Instance.Page.backwardButton.navigate();
    } else {
      this.saveComplete = false;
      this.isShowTemplateSavePanel = false;
    }    
  }

  public onFileUpload(data: File[]) {
    this.files = data;
  }

  onFileUploadError(error: { ShortMessage: '' }[]) {
    this.errors = error;
  }
}
