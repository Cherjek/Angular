import {
  Component,
  OnDestroy,
  OnInit,
  HostListener,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { EntityViewProperty } from 'src/app/services/common/Models/EntityViewProperty';
import { LogicDeviceKindService } from 'src/app/services/references/logic-device-kind-types.service';
import { LogicDeviceKindProperty } from 'src/app/services/references/models/LogicDeviceKindProperty';
import { PropertiesEditorPanelComponent } from 'src/app/shared/rom-forms/properties.editor.panel/properties.editor.panel';

@Component({
  selector: 'rom-logic-device-kinds-card-parameters',
  templateUrl: './logic-device-kinds-card-parameters.component.html',
  styleUrls: ['./logic-device-kinds-card-parameters.component.less']
})
export class LogicDeviceKindsCardParametersComponent
  implements OnInit, OnDestroy {
  private router$: Subscription;
  private getData$: Subscription;

  logicDeviceKindId: number;
  logicDeviceId: number;
  @ViewChild('propertiesEditorPanel', { static: false })
  propertiesEditorPanel: PropertiesEditorPanelComponent;

  properties: EntityViewProperty[];
  isPropEdit = false;

  errorsPropertyPanel: any[] = [];
  loadingPropertyPanel: boolean;

  constructor(
    public activatedRoute: ActivatedRoute,
    public logicDeviceKindPropsService: LogicDeviceKindService,
    public router: Router
  ) {
    this.router$ = this.activatedRoute.parent.params.subscribe(params => {
      const id = params.id;
      logicDeviceKindPropsService.logicDeviceKindId = this.logicDeviceKindId = id;
      logicDeviceKindPropsService.logicDeviceId = this.logicDeviceId =
        params.logicDeviceId;
    });
  }

  ngOnInit() {
    this.loadParameter();
  }

  @HostListener('document:keydown', ['$event']) onSaveCancel(
    event: KeyboardEvent
  ) {
    if (this.isPropEdit) {
      if (event.ctrlKey) {
        if (event.keyCode === 83) {
          event.preventDefault();
          this.saveParam(this.propertiesEditorPanel.getEditProperties());
        }
      } else {
        if (event.keyCode === 27) {
          this.rollbackPropertyChanges(this.propertiesEditorPanel);
        }
      }
    }
  }

  loadParameter() {
    this.isPropEdit = false;
    this.loadingPropertyPanel = true;
    this.getData$ = 
      forkJoin(
        this.logicDeviceKindPropsService.getProps(),
        this.logicDeviceKindPropsService.get()
      )
      .subscribe(
      (data: any[]) => {
        const propsKind = data[0];
        const allProps = data[1];
        const newData = (allProps || []).map((prop: any) => {
          const propNew: EntityViewProperty  = Object.assign(new EntityViewProperty(), prop);
          propNew.Type = 4; // 4 means 'string' type
          const propKind = (propsKind || []).find((p: any) => p.PropertyType.Id === prop.Id);
          if (propKind) {
            propNew.Value = propKind.Value;
          }
          return propNew;
        });
        this.properties = newData;
        this.loadingPropertyPanel = false;
      },
      (error: any) => {
        this.errorsPropertyPanel = [error];
        this.loadingPropertyPanel = false;
      }
    );
  }

  ngOnDestroy() {
    this.unsub(this.router$);
    this.unsub(this.getData$);
  }

  saveParam(properties: LogicDeviceKindPropertyLocal[]) {
    this.loadingPropertyPanel = true;
    const logicDeviceKindProperty = (properties || [])
      .filter(x => x.Value != null)
      .map(kindProp => {
      if (kindProp) {
        const { Type, Value, ...propertyType } = kindProp;
        const prop = new LogicDeviceKindProperty();
        prop.IdLogicDeviceKind = this.logicDeviceKindId;
        prop.PropertyType = propertyType;
        prop.Value = Value;
        return prop;
      }
    });
    this.logicDeviceKindPropsService
      .postProps(logicDeviceKindProperty)
      .then(() => {
        this.loadParameter();
      })
      .catch(error => {
        this.loadingPropertyPanel = false;
        this.errorsPropertyPanel = [error];
      });
  }

  rollbackPropertyChanges(propertyEditor: any) {
    propertyEditor.rollbackProperty();
    this.isPropEdit = false;
  }

  private unsub(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }
}

interface LogicDeviceKindPropertyLocal {
  Id: number;
  IdLogicDeviceType: number;
  Name: string;
  Code: string;
  Type: number;
  Value: string;
}
