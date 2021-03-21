import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, Subject, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { EntityViewProperty } from 'src/app/services/common/Models/EntityViewProperty';
import { LogicDeviceEditorTagsService } from 'src/app/services/objecteditors.module/logicDevice.editor/lde.tags/LogicDeviceEditorTags';
import { IPropertyEditorService } from 'src/app/services/objecteditors.module/Models/IPropertyEditorService';
import { ScriptTagsEditorService } from 'src/app/services/objecteditors.module/tags.editor/ScriptTagsEditor.service';
import { PropertiesEditorPanelComponent } from 'src/app/shared/rom-forms';

type TagScriptVariableView = { Id: number, IdValueType: number, Name: string };
type TagScriptInVariableView = { Variable: TagScriptVariableView, Tag: any };

@Component({
  selector: 'app-tags-params',
  templateUrl: './tags-params.component.html',
  styleUrls: ['./tags-params.component.less'],
  providers: [ScriptTagsEditorService]
})
export class TagsParamsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private subscriptionQuery: Subscription;

  public properties: EntityViewProperty[];
  @Input() public isPropEdit: boolean = false;
  @ViewChild('propertiesEditorPanel', { static: false })
  propertiesEditorPanel: PropertiesEditorPanelComponent;

  public errorsPropertyPanel: any[] = [];
  public loadingPropertyPanel: boolean;

  private propertyEditorService: IPropertyEditorService;
  data$: Subscription;

  private _destructor = new Subject();

  @Input() unitId: number;
  @Input() tagId: number;
  @Input() 
  set scriptEdit(_script: any) {
    this.updateScript(_script);
  }
  @Input()
  set rollback(val: number) {
    if (val) {
      this.loadData();
    }
  }
  @Output() init = new EventEmitter<any>();
  @Output() saveComplete = new EventEmitter<any>();
  script: any;
  ldeTags$: Subscription;
  tag: any;  
  scripts: any[];
  tagsUnit: any[];


  constructor(
    private scriptTagsEditorService: ScriptTagsEditorService,
    private ldeTagsService: LogicDeviceEditorTagsService,
    private activateRoute: ActivatedRoute
  ) {
    // this.unitId = activateRoute.parent.snapshot.queryParams.unitId;
    // this.tagId = activateRoute.parent.snapshot.queryParams.ids;
  }

  ngOnInit() {
    this.init.emit(this);
    this.loadData();
  }

  ngOnDestroy() {
    this.unsubscriber([this.ldeTags$]);
  }

  unsubscriber(subs: Subscription[]) {
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  loadData() {
    this.loadingPropertyPanel = true;
    this.ldeTags$ = forkJoin([
      this.tagsUnit ? of(this.tagsUnit) : this.scriptTagsEditorService.getUnitTags(this.unitId),
      this.scriptTagsEditorService.getLogicDeviceTag(this.tagId),
      this.scripts ? of(this.scripts) : this.scriptTagsEditorService.getScripts()
    ])
    .pipe(
      takeUntil(this._destructor),
      finalize(() => this.loadingPropertyPanel = false)
    )
    .subscribe((data) => {
      this.tagsUnit = data[0].filter((x: any) => x.TagType.Id === 0);
      this.tag = data[1];
      this.scripts = data[2];
      this.updateScript(data[1].Script);      
    }, 
    (error: any) => {
        this.errorsPropertyPanel = [error];
    });
  }

  updateScript(script: any) {
    if (script == null) return;
    this.script = this.scripts.find((x: any) => x.Name === script.Name);
    if (this.script) {
      this.properties = this.script.InVariables.map((x: any) => {
        const prop = new EntityViewProperty();
        prop.Code = x.Id;
        prop.Name = x.Name;
        prop.Type = 15;
        prop['arrayValues'] = this.loadDataValues();
        if (this.tag['ScriptInVariables'] != null) {
          const scriptInVariables = <TagScriptInVariableView>(
            this.tag['ScriptInVariables'].find(
              (z: any) => z.Variable.Id === x.Id
            )
          );
          if (scriptInVariables != null) {
            prop.Value = prop['arrayValues'].find(
              (v: any) => v.Code === scriptInVariables.Tag.Id
            );
          }
        }
        return prop;
      });
    }
  }

  loadDataValues() {
    return this.tagsUnit.map((x: any) => ({
      Code: x.Id,
      Text: `${x.LogicDevice.Name}, ${x.LogicTagType.Code} (${x.LogicTagType.Name})`
    }));
  }

  changeProperties() {
    this.isPropEdit = true;
  }

  rollbackPropertyChanges(propertyEditor: any) {
    // if (!propertyEditor) {
    //   propertyEditor = this.propertiesEditorPanel;
    // }
    // propertyEditor.rollbackProperty();
    this.isPropEdit = false;
    this.loadData();    
  }

  saveObject(properties: any[]) {
    this.tag['ScriptInVariables'] = properties.filter((x: any) => x.Value != null).map((x: any) => {
      const scVar = <TagScriptInVariableView>{};
      scVar.Tag = this.tagsUnit.find((y: any) => y.Id === x.Value.Code);
      scVar.Variable = this.script.InVariables.find((z: any) => z.Id === x.Code);
      return scVar;
    });

    this.loadingPropertyPanel = true;

    this.scriptTagsEditorService
      .save(this.tag)
      .then((result: any) => {
        this.loadingPropertyPanel = false;
        this.loadData();
        this.saveComplete.emit();
      })
      .catch((error: any) => {
        this.loadingPropertyPanel = false;
        this.errorsPropertyPanel = [error];
      });
  }
}
