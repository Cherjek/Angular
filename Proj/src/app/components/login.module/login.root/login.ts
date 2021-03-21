import { AppLocalization } from 'src/app/common/LocaleRes';
﻿import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { LoginService } from '../../../services/login.module/login.service';
import { keyStorageBasketName } from '../../../components/objects.module/objects/objects';
import { keyStorageUrlHistory } from '../../../common/UrlHistory/UrlHistory';
import { keyCachedNameTable, 
         keyStorageUrl } from '../../../components/datapresentation.module/datapresentation.create/datapresentation.create';
import { storage as keyStorageDataResultSettings } from '../../../services/datapresentation.module/DataResultSettings.service';
import { keyStorageBasketFooterComponent } from '../../../modules/data-presentation/containers/basket-footer/basket-footer.component';
import { PermissionCheck } from '../../../core';
import { filterJournalValuesKey, currentNavKey } from '../../../modules/hierarchy-main/components/hierarchy-main/hierarchy-main.component';

import { GlobalValues } from '../../../core';
import { Subscription } from 'rxjs';
import { ILogingFrom } from './ilogin-form';
import { finalize, delay } from 'rxjs/operators';

@Component({
    selector: 'login-root',
    templateUrl: 'login.html',
    styleUrls: ['login.css']
})

export class LoginForm implements OnInit, OnDestroy {
    permissionCheck$: Subscription;

    constructor(
        private sanitizer: DomSanitizer,
        public router: Router,
        public loginService: LoginService,
        public permissionCheck: PermissionCheck) { }

    ngOnInit() {
        localStorage.removeItem(keyStorageBasketName);
        localStorage.removeItem(keyStorageUrlHistory);
        localStorage.removeItem(keyStorageDataResultSettings);
        localStorage.removeItem(keyCachedNameTable);
        localStorage.removeItem(keyStorageUrl);
        localStorage.removeItem(keyStorageBasketFooterComponent);
        localStorage.removeItem(filterJournalValuesKey);
        localStorage.removeItem(currentNavKey);
        sessionStorage.clear();
        this.loginService.dropUserApp();
        this.permissionCheck.dropUser();

        this.loadHtml = true;
        this.loginService
          .formHtml()
          .pipe(
            finalize(() => {
              this.loadHtml = false;
              localStorage.setItem('notCustomTheme', (this.formHtml == null).toString());
            })
          )
          .subscribe((html: string) => { 
            if (html) {
              this.formHtml = this.sanitizer.bypassSecurityTrustHtml(html);
            }
          });
    }

    formHtml: SafeHtml;
    loadHtml: boolean;

    validateAndLogin(form: ILogingFrom) {
      this.loginService.post({
        userName: form.login,
        password: form.password
      })
        .then(() => {

            this.permissionCheck$ = this.permissionCheck
                .updateAccessUser()
                .subscribe(() => {

                    form.asyncStart = false;

                    let page = 'hierarchy-main';
                    if (GlobalValues.Instance.userApp.IsPersonalArea) {
                        page = 'personal-account';
                    }

                    this.router.navigate([page]);
                })

        })
        .catch((error: any) => {
            form.errorEvent(error.error_description || error.error || error.Message || AppLocalization.ThereWasAMistake);
        });
    }

    ngOnDestroy() {
        if (this.permissionCheck$) {
            this.permissionCheck$.unsubscribe();
        }
    }
}