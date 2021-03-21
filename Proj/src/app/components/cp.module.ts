import { NgModule } from '@angular/core';
import { ValidationModule } from './validation.module/module';
import { ObjectsModule } from './objects.module/module';
import { ReportsModule } from './reports.module/module';
import { DataPresentationModule } from './datapresentation.module/module';
import { ObjectEditorModule } from './objecteditors.module/module';
import { LoginModule } from './login.module/module';
import { DictionaryService } from '../services/common/Dictionary.service';
import { EquipmentService } from '../services/common/Equipment.service';
import { FiltersService } from '../services/common/Filters.service';

import { CoreModule } from '../core/core.module';

@NgModule({
    imports: [
        ValidationModule,
        ObjectsModule,
        ReportsModule,
        DataPresentationModule,
        ObjectEditorModule,
        LoginModule,

        CoreModule
    ],
    providers: [
        DictionaryService,
        EquipmentService,
        FiltersService
    ]
})
export class ViewsModule {
}
