import { AppLocalization } from 'src/app/common/LocaleRes';
import { WebService } from 'src/app/services/common/Data.service';
import { Injectable } from '@angular/core';
import { EntityType } from '../Models/EntityType';
import { EntityTypeProp } from '../Models/EntityTypeProp';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Property } from '../Models/Property';
import { ObjectView } from '../Models/ObjectView';
import { ObjectViewNode } from '../Models/ObjectViewNode';
import { BaseTaskParameters } from '../Models/interfaces/BaseTaskParameters';

@Injectable({
  providedIn: 'root'
})
export class PropertyUpdateEntityTypesService extends WebService<BaseTaskParameters | EntityTypeProp | ObjectView> {
  URL = 'commissioning/export-import';

  private baseParameters: BaseTaskParameters;
  getParameters() {
    if (this.baseParameters)
    return of(this.baseParameters)
    else return new Observable(
      obs => {
        (super.get('parametrs') as Observable<BaseTaskParameters>)
          .subscribe(
            results => {
              this.baseParameters = results;
              obs.next(results);
              obs.complete();
            },
            errors => obs.error(errors)
          );
      }
    ) as Observable<BaseTaskParameters>;
  }

  getEntitiesProps() {
    const recursive = (property: Property[]) => {
      property.forEach(x => {
        x['UniqueId'] = x.Code;
        if (x.Children && x.Children.length) {
          recursive(x.Children);
        }
      });
    }    
    return super.get('entity-types-ex')
      .pipe(
        map((x: EntityTypeProp[]) => {
          x.forEach(y => recursive(y.PropertyTypes))          
          return x;
        })
      );
  }

  getActionTypes() {  
    return super.get('action-types') as Observable<any[]>;
  }

  getObjectViews() {  
    return super.get('objects') as Observable<ObjectView[]>;
  }

  getObjectViewNodes() {
    return this.getObjectViews()
      .pipe(
        map((x: ObjectView[]) => {
          return x.map(y => {
            const objViewNode = new ObjectViewNode();
            objViewNode.UniqueId = objViewNode.Id = y.Id;
            objViewNode.Name = y.Name;
            objViewNode.Nodes = [
              Object.assign(new ObjectViewNode(), { Id: 1, UniqueId: Number('1' + objViewNode.Id), Name: AppLocalization.Equipment }),
              Object.assign(new ObjectViewNode(), { Id: 2, UniqueId: Number('2' + objViewNode.Id), Name: AppLocalization.Label110 })
            ];
            if (y.LogicDevices != null) {
              objViewNode.Nodes[0].Nodes = y.LogicDevices.map(ld => Object.assign(new ObjectViewNode(), { Id: ld.Id, UniqueId: ld.Id, Name: ld.Name }));
            }
            if (y.Devices != null) {
              objViewNode.Nodes[1].Nodes = y.Devices.map(d => Object.assign(new ObjectViewNode(), { Id: d.Id, UniqueId: d.Id, Name: d.Name }));
            }
            return objViewNode;
          });
        })
      );
  }

  save(data: any) {
    return super.post(data, 'export-start');
  }

  saveImportWithFiles(data: any, files: File[]) {
    const formData: FormData = new FormData();
    (files || []).forEach(file => {
      formData.append("files", file, file.name);
    });
    formData.append("import", JSON.stringify(data));
    return super.postFormData(formData, 'import-start/files')
  }

  saveTemplate(template: any, type: string) {
    if (type === 'import') {
      return super.post(template, 'import-create-template');
    } else {
      return super.post(template, 'export-create-template');
    }
  }

  getTemplate(type: number, id: number) {
    return super.get((type === 1 ? 'export-template' : 'import-template') + `/${id}`);
  }
}
