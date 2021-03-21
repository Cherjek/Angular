import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { MatSortModule } from '@angular/material/sort';

import { MatTreeComponent, MatTreeActionButtonsComponent } from './mat-tree';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [ MatTreeComponent, MatTreeActionButtonsComponent ],
    imports: [
        NgbModule,
        CommonModule, 
        MatMenuModule, MatTabsModule, MatTableModule, MatSortModule, MatTreeModule],
    exports: [
        MatMenuModule, 
        MatTabsModule, 
        MatTableModule, 
        MatSortModule, 
        
        MatTreeComponent,
        MatTreeActionButtonsComponent
    ],
})
export class MaterialAngularModule { }