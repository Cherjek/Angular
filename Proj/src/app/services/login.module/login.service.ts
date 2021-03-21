import { Injectable } from '@angular/core';
import { WebService } from "../common/Data.service";
import { Observable, Observer } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { UserApp } from "../common/Models/User";

import { GlobalValues } from '../../core';

@Injectable({
    providedIn: 'root'
})
export class LoginService extends WebService<any> {
    
    URL = "token";
    
    post(params: any): Promise<Object> {
        return new Promise((resolve, reject) => {

            params["grant_type"] = "password";

            this.postLogin(`userName=${params.userName}&password=${params.password}&grant_type=password`)
                .then((__token: any) => {

                    const convertStringToBoolean = (val: string): boolean => {
                        val = val.toLowerCase();
                        return val === 'true' ? true : !(val === 'false');
                    }

                    const startPageRedirect: string = this.appConfig.getConfig('startPage');

                    GlobalValues.Instance.userApp = Object.assign(new UserApp(),
                        {
                            UserName: __token.UserName,
                            IsSuperUser: typeof __token.IsSuperUser === 'string' ? convertStringToBoolean(__token.IsSuperUser) : __token.IsSuperUser,
                            StartPage: __token.StartPage,
                            IsPersonalArea: __token.StartPage === startPageRedirect,
                            Token: __token.access_token
                        });

                    resolve();
                })
                .catch((error: any) => { reject(error); });
        });
    }

    dropUserApp() {
        GlobalValues.Instance.userApp = null;
        GlobalValues.Instance.hierarchyApp = null;
    }

    formHtml() {
      return new Observable(sbs => {
        this.appConfig.getConfigObservable('host')
          .subscribe(host => {
            this.http.get(`${host}/themes-loader`)
              .subscribe(themes => {
                sbs.next(themes);
                sbs.complete();
              })
          });
      });
    }
}
