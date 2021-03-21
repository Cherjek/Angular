import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { GlobalValues } from 'src/app/core';
import { PropertyUpdateEntityTypesService } from 'src/app/services/property-update/entity/property-update-entity-types.service';
import { EntityTypeProp } from 'src/app/services/property-update/Models/EntityTypeProp';
import { Property } from 'src/app/services/property-update/Models/Property';
import { keyProperties } from '../../../export-import-create/components/property-update-export-import-create/property-update-export-import-create.component';

@Component({
  selector: 'app-property-tree',
  templateUrl: './property-tree.component.html',
  styleUrls: ['./property-tree.component.less']
})
export class PropertyTreeComponent implements OnInit {

  entityCode: string;
  entity: EntityTypeProp;
  valuesSelect: Property[];
  selectNodes: Property[];
  private get entityProperties() {
    let properties = sessionStorage.getItem(keyProperties);
    if (properties != null) return JSON.parse(properties);
    return undefined;
  }

  loadingPanel: boolean;
  errors: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private propUpdateEntityTypesService: PropertyUpdateEntityTypesService) {       
    this.entityCode = this.activatedRoute.snapshot.params.entity;
  }

  ngOnInit() {
    this.loadingPanel = true;
    this.propUpdateEntityTypesService
      .getEntitiesProps()
      .pipe(finalize(() => (this.loadingPanel = false)))
      .subscribe(
        (data: EntityTypeProp[]) => {
          if (this.entityProperties != null && this.entityProperties[this.entityCode] != null) {            
            this.valuesSelect = this.entityProperties[this.entityCode];
          }
          this.entity = data.find(x => x.Code === this.entityCode);          
        },
        (error) => {this.errors = [error];}
      );
  }
  
  save() {
    const properties = {};
    properties[this.entityCode] = this.selectNodes;
    GlobalValues.Instance.Page = {
      PropertyTreeComponentNodes: properties
    }
    GlobalValues.Instance.Page.backwardButton.navigate();
  }

  cancel() {
    GlobalValues.Instance.Page.backwardButton.navigate();
  }
}
