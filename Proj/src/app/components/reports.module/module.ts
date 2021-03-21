import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* components */
import { SharedModule } from "../../shared/shared.module";

import { ReportsCreateComponent } from "./reports.create/reports.create";
import { ReportsQueueComponent } from "./reports.queue/reports.queue";
import { ReportsResultComponent } from "./reports.result/reports.result";
import { ReportsResultLogComponent } from "./reports.result/reports.result.log/reports.result.log";
import { ReportResultObjectsComponent } from "./reports.result/reports.result.objects/reports.result.objects";

/* services */
//import { DictionaryService } from '../../services/common/Dictionary.service';
//import { EquipmentService } from '../../services/common/Equipment.service';

import { ReportDirsService } from '../../services/reports.module/ReportDirs.service';
import { ReportDirItemsService } from '../../services/reports.module/ReportDirItems.service';
import { ReportQueueService } from '../../services/reports.module/ReportQueue.service';
import { ReportCreateService } from '../../services/reports.module/ReportCreate.service';
import {DownloadFileService} from '../../services/reports.module/DownloadFile.service';
import { ReportResultDataService } from '../../services/reports.module/Result/ReportResultData.service';
import { ReportResultLogsService } from '../../services/reports.module/Result/ReportResultLogs.service';
import { ReportResultObjectsService } from '../../services/reports.module/Result/ReportResultObjects.service';
import { ReportRepeatWithUnitsService } from '../../services/reports.module/ReportRepeatWithUnits.service';

/* controls */
import { ControlsModule } from '../../controls/ct.module';
import { SharedHierarchyModule } from '../shared/shared.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,

        ControlsModule,
        SharedModule,
        SharedHierarchyModule
    ],
    exports: [],
    providers: [
        //DictionaryService,
        //EquipmentService,
        ReportDirsService,
        ReportDirItemsService,
        ReportQueueService,
        ReportCreateService,
        DownloadFileService,
        ReportResultDataService,
        ReportResultLogsService,
        ReportResultObjectsService,
        ReportRepeatWithUnitsService
    ],
    declarations: [
        /**
         * views
         */
        ReportsCreateComponent,
        ReportsQueueComponent,
        ReportsResultComponent,
        ReportsResultLogComponent,
        ReportResultObjectsComponent
    ]
})
export class ReportsModule { }
