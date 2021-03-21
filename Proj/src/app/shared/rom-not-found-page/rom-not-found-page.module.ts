import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ControlsModule } from '../../controls/ct.module';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ControlsModule
    ],
    declarations: [
        NotFoundPageComponent,
    ]
})
export class NotFoundPageModule { }
