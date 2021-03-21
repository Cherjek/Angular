import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MaterialAngularModule } from './material-angular/material-angular.module';
import { RomDirectivesModule } from './rom-directives/rom-directives.module';
import { RomLoaderModule } from './rom-loader/rom-loader.module';
import { NotFoundPageModule } from './rom-not-found-page/rom-not-found-page.module';
import { RomPipesModule } from './rom-pipes/rom-pipes.module';
import { RomFormsModule } from './rom-forms/rom-forms.module';
import { RomUploaderModule } from './rom-uploader/rom-uploader.module';
import { RomAdvertModule } from './rom-advert/rom-advert.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        RomAdvertModule,
        RomLoaderModule.forRoot()
    ],
    declarations: [
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,

        MaterialAngularModule,
        RomDirectivesModule,
        RomLoaderModule,
        NotFoundPageModule,
        RomPipesModule,
        RomFormsModule,
        RomUploaderModule,
        RomAdvertModule
    ]
})
export class SharedModule { }