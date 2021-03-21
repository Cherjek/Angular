import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule as Sh } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { FilterByFieldPipe } from './pipes/filter.by.field.pipe';
import { DataQueryTypeChannelsComponent } from './components/data-query-type-channels/data-query-type-channels.component';
import { QueryTypeTagsComponent } from './components/query-type-tags/query-type-tags.component';

@NgModule({
    declarations: [FilterByFieldPipe, DataQueryTypeChannelsComponent, QueryTypeTagsComponent],
    imports: [
        CommonModule,
        ControlsModule,
        Sh,
        CoreModule
    ],
    exports: [
        DataQueryTypeChannelsComponent,
        QueryTypeTagsComponent,
        FilterByFieldPipe
    ]
})
export class SharedModule { }
