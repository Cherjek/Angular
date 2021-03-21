import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* components */
import { ObjectsComponent } from "./objects/objects";
import { ObjectDetails } from './object.details/object.details';

import { ObjDetailsMap } from './object.details/Components/obj.details.map';

/* services */
import { DataObjectsService } from '../../services/objects.module/DataObjects.service';

import { ObjectInjectService } from './objects/object.service';

import { FilterObjectsContainerService } from '../../services/objects.module/Filters/FilterContainer.service';
import { AllFiltersService } from '../../services/objects.module/Filters/AllFilters.service';
import { FiltersService } from '../../services/objects.module/Filters/Filters.service';
import { FiltersTemplateService } from '../../services/objects.module/Filters/FiltersTemplate.service';

import { UnitStatusesService } from '../../services/objects.module/Units/UnitStatuses.service';
import { LDStatusesService } from '../../services/objects.module/LogicDevices/LDStatuses.service';

import { UnitMapService } from '../../services/objects.module/Units/UnitMap.service';
import { LDMapService } from '../../services/objects.module/LogicDevices/LDMap.service';

/* controls */
import { SharedModule } from "../../shared/shared.module";
import { ControlsModule } from '../../controls/ct.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,

        SharedModule,
        ControlsModule
    ],
    exports: [],
    providers: [
        DataObjectsService,

        FilterObjectsContainerService,
        FiltersService,
        AllFiltersService,
        FiltersTemplateService,

        ObjectInjectService,
        UnitStatusesService,
        LDStatusesService,
        UnitMapService,
        LDMapService
    ],
    entryComponents: [ ObjDetailsMap ],
    declarations: [
        ObjectsComponent,
        ObjectDetails,

        ObjDetailsMap
    ]
})
export class ObjectsModule { }
