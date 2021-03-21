import { NgModule } from '@angular/core';
import { ManagementsMainComponent } from './components/managements-main/managements-main.component';
import { ManagementsRoutingModule } from './managements-routing.module';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { ManagementsMainService } from 'src/app/services/managements.module/managements-main.service';


@NgModule({
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule,

        ManagementsRoutingModule
    ],
    exports: [],
    declarations: [ManagementsMainComponent],
    providers: [ManagementsMainService],
})
export class ManagementsModule { }
