import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* components */
import { SharedModule } from "../../shared/shared.module";


import { ValidationCreateComponent } from "./validation.create/validation.create";
import { ValidationQueueComponent } from "./validation.queue/validation.queue";
import { ValidationResultComponent } from "./validation.result/validation.result";
import { ValidationResultMainComponent } from "./validation.result/validation.result.main/validation.result.main";
import { ValResultMainDetailComponent } from "./validation.result/validation.result.main/details.row/val.result.main.detail";
import { ValidationResultLogComponent } from "./validation.result/validation.result.log/validation.result.log";
import { ValidationResultObjectsComponent } from "./validation.result/validation.result.objects/validation.result.objects";
import { ValidationResultSettingsComponent } from "./validation.result/validation.result.settings/validation.result.settings";

/* services */
//import { DictionaryService } from '../../services/common/Dictionary.service';
//import { EquipmentService } from '../../services/common/Equipment.service';

import { ValidationCreateSettingService } from '../../services/validation.module/ValidationCreateSetting.service';
import { ValidationCreateTemplateService } from '../../services/validation.module/ValidationCreateTemplate.service';
import { ValidationJobService } from '../../services/validation.module/ValidationJob.service';
import { ValidationResultObjectsService } from '../../services/validation.module/ValidationResultObjects.service';
import { ValidationResultLogsService } from '../../services/validation.module/ValidationResultLogs.service';
import { ValidationResultSettingService } from '../../services/validation.module/ValidationResultSetting.service';
import { ValidationResultDataService } from '../../services/validation.module/ValidationResultData.service';
import { ValidationResultInfoService } from '../../services/validation.module/ValidationResultInfo.service';
import { ValidationResultService } from '../../services/validation.module/ValidationResult.service';
import { ValidationResultTagsLDService } from '../../services/validation.module/ValidationResultTagsLD.service';

/* controls */
import { ControlsModule } from '../../controls/ct.module';

@NgModule({  
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,

        ControlsModule,
        SharedModule
    ],
    exports: [],
    providers: [
        //DictionaryService,
        //EquipmentService,
        ValidationCreateSettingService,
        ValidationCreateTemplateService,
        ValidationJobService,
        ValidationResultObjectsService,
        ValidationResultLogsService,
        ValidationResultSettingService,
        ValidationResultDataService,
        ValidationResultInfoService,
        ValidationResultService,
        ValidationResultTagsLDService
    ],
    entryComponents: [
        ValResultMainDetailComponent
    ],
    declarations: [
        /**
         * views
         */
        ValidationCreateComponent,
        ValidationQueueComponent,

        ValidationResultComponent,
        ValidationResultMainComponent,
        ValResultMainDetailComponent,
        ValidationResultLogComponent,
        ValidationResultObjectsComponent,
        ValidationResultSettingsComponent
    ]
})
export class ValidationModule { }
