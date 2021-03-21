import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalValues } from 'src/app/core';
import { PropertyUpdateEntityTypesService } from 'src/app/services/property-update/entity/property-update-entity-types.service';
import { EntityTypeProp } from 'src/app/services/property-update/Models/EntityTypeProp';
import { Property } from 'src/app/services/property-update/Models/Property';
import { keyProperties } from '../../../export-import-create/components/property-update-export-import-create/property-update-export-import-create.component';

@Component({
  selector: 'app-exp-imp-property-tree',
  templateUrl: './property-tree.component.html',
  styleUrls: ['./property-tree.component.less']
})
export class ExpImpPropertyTreeComponent implements OnInit {

  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() entitiesProps: EntityTypeProp[];
  @Input() valuesSelect: Property[];
  selectNodes: Property[];  
  constructor() { 
  }

  ngOnInit() {
    
  }
}
