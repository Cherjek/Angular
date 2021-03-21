import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginForm } from './login.root/login';
import { LoginDefaultForm } from './login.root/components/login-default/login-default';
import { LoginCustomForm } from './login.root/components/login-custom/login-custom';
import { ControlsModule } from '../../controls/ct.module';

import { LoginService } from '../../services/login.module/login.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        ControlsModule
    ],
    exports: [],
    providers: [
        LoginService
    ],
    declarations: [  
        LoginForm,
        LoginDefaultForm,
        LoginCustomForm
    ]
})
export class LoginModule { }
