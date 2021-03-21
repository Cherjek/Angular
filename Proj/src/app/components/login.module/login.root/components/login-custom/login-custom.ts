import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ILogingFrom } from '../../ilogin-form';

@Component({
  selector: 'login-custom',
  templateUrl: 'login-custom.html',
  styleUrls: ['login-custom.less'],
})
export class LoginCustomForm implements AfterViewInit {
  permissionCheck$: Subscription;
  inputTextControl: any;
  inputPasswordControl: any;
  inputButtonControl: any;
  errorMain: any;
  errorLogin: any;
  errorPassword: any;

  isPassValid: boolean;
  isLoginValid: boolean;
  login: string;
  password: string;

  errorText: string;
  asyncStart = false;
  @Output() onSubmit = new EventEmitter<any>();
  constructor() {}

  ngAfterViewInit(): void {
    this.inputTextControl = document
      .querySelector('#main-custom-login')
      .querySelector('input[type="text"');
    this.inputPasswordControl = document
      .querySelector('#main-custom-login')
      .querySelector('input[type="password"');
    this.inputButtonControl = document
      .querySelector('#main-custom-login')
      .querySelector('button');
    this.inputButtonControl.onclick = (event: Event) => {
      this.validateAndLogin();
    };

    this.errorMain = document
      .querySelector('#main-custom-login')
      .querySelector('#error-main');
    this.errorLogin = document
      .querySelector('#main-custom-login')
      .querySelector('#error-login');
    this.errorPassword = document
      .querySelector('#main-custom-login')
      .querySelector('#error-password');
  }

  keyDown(event: any) {
    if (event.keyCode === 13) {
      //enter
      this.validateAndLogin();
    }
  }

  checkedField() {
    this.errorMain.style.display = 'none';
    this.errorLogin.style.display = 'none';
    this.errorPassword.style.display = 'none';
    this.inputTextControl.classList.remove('error');
    this.inputPasswordControl.classList.remove('error');

    this.login = this.inputTextControl.value;
    this.password = this.inputPasswordControl.value;

    this.isLoginValid = this.login != null && this.login.length > 0;
    this.isPassValid = this.password != null && this.password.length > 0;

    if (!this.isLoginValid) {
      this.errorLogin.style.display = 'block';
      this.inputTextControl.classList.add('error');
    } 
    if (!this.isPassValid) {
      this.errorPassword.style.display = 'block';
      this.inputPasswordControl.classList.add('error');
    }

    return this.isLoginValid && this.isPassValid;
  }

  validateAndLogin() {
    if (this.checkedField()) {
      this.inputButtonControl.setAttribute('disabled', true);
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
    this.errorMain.style.display = 'block';
    this.inputButtonControl.removeAttribute('disabled');
  }
}
