import { AppLocalization } from 'src/app/common/LocaleRes';
﻿import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ILogingFrom } from '../../ilogin-form';

@Component({
    selector: 'login-default',
    templateUrl: 'login-default.html',
    styleUrls: ['login-default.css']
})

export class LoginDefaultForm {
    permissionCheck$: Subscription;

    constructor() { }

    isPassValid: boolean;
    isLoginValid: boolean;
    login: string;
    password: string;

    errorText: string;
    asyncStart = false;

    @ViewChild("loginInput", { static: true }) loginInput: any;
    @ViewChild("passInput", { static: true }) passInput: any;

    @Output() onSubmit = new EventEmitter<any>();

    keyDown(event: any) {
        if (event.keyCode === 13) {
            //enter
            this.validateAndLogin();
        }
    }

    checkedField() {

        let result = false;

        this.isLoginValid = this.loginInput.isValid();
        this.isPassValid = this.passInput.isValid();

        if (!this.isLoginValid && !this.isPassValid) {
            this.errorText = AppLocalization.UsernamePasswordRequest;
        }
        else if (!this.isLoginValid) {
            this.errorText = AppLocalization.UsernameRequest;
        }
        else if (!this.isPassValid) {
            this.errorText = AppLocalization.PasswordRequest;
        }
        else
            result = true;

        return result;
    }

    validateAndLogin() {
        if (this.checkedField()) {
            this.errorText = null;

            this.asyncStart = true;
            const response = <ILogingFrom>{};
            response.login = this.login;
            response.password = this.password;
            response.asyncStart = this.asyncStart;
            response.errorText = this.errorText;
            response.errorEvent = (error) => { this.errorEvent(error); };
            this.onSubmit.emit(response);
        }
    }

    errorEvent(error: string) {
      this.errorText = error;
      this.asyncStart = false;
    }
}