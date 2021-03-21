import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from "../../shared/shared.module";
import { ControlsModule } from '../../controls/ct.module';

import { TagsBasketComponent } from './Components/tags.basket/tags.basket';
import { DataPresentationCreateComponent } from './datapresentation.create/datapresentation.create';
import { DatapresentationResultComponent } from './datapresentation.result/datapresentation.result';
import { DatapresentationResultCompareTagsComponent } from './datapresentation.result.comparetags/datapresentation.result.comparetags';

import { DatapresentationResultDataComponent } from './datapresentation.result/datapresentation.result.data/datapresentation.result.data';
import { DatapresentationResultDataGraphComponent } from './datapresentation.result/datapresentation.result.data/datapresentation.result.data.graph/datapresentation.result.data.graph';
import { DatapresentationResultDataTablesComponent } from './datapresentation.result/datapresentation.result.data/datapresentation.result.data.tables/datapresentation.result.data.tables';
import { DatapresentationResultTagsComponent } from './datapresentation.result/datapresentation.result.tags/datapresentation.result.tags';
import { DatapresentationResultInnerTagsComponent } from './datapresentation.result/datapresentation-result-inner-tags/datapresentation-result-inner-tags.component';

import { DataResultSettingsService, DataResultCompareSettingsService } from '../../services/datapresentation.module/DataResultSettings.service';
import { ObjectUnitTagsService } from '../../services/datapresentation.module/ObjectUnitTags.service';
import { ObjectTagsValueService } from '../../services/datapresentation.module/ObjectTagsValue.service';
import { HierarchyTagsValueService } from '../../services/datapresentation.module/HierarchyTagsValue.service';
import { ObjectTagsValuePivotService } from '../../services/datapresentation.module/ObjectTagsValuePivot.service';

import { FilterDataPresentContainerService } from '../../services/datapresentation.module/Filters/FilterContainer.service';
import { AllFiltersService } from '../../services/datapresentation.module/Filters/AllFilters.service';
import { FiltersService } from '../../services/datapresentation.module/Filters/Filters.service';

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
        DataResultSettingsService,
        DataResultCompareSettingsService,
        ObjectUnitTagsService,
        ObjectTagsValueService,
        HierarchyTagsValueService,
        ObjectTagsValuePivotService,

        FilterDataPresentContainerService,
        AllFiltersService,
        FiltersService
    ],
    declarations: [
        TagsBasketComponent,
        DataPresentationCreateComponent,
        DatapresentationResultComponent,
        DatapresentationResultDataComponent,
        DatapresentationResultDataGraphComponent,
        DatapresentationResultDataTablesComponent,
        DatapresentationResultTagsComponent,
        DatapresentationResultCompareTagsComponent,
        DatapresentationResultInnerTagsComponent,
    ],
    entryComponents: [DatapresentationResultInnerTagsComponent]
})
export class DataPresentationModule { }
