import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, delay, catchError, tap } from 'rxjs/operators';

import { UserApp } from "../../services/common/Models/User";
import { GlobalValues } from '../../core';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    get userApp(): UserApp {
        return GlobalValues.Instance.userApp;
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.userApp) {
            const token = this.userApp.Token;
            if (token) {
                req = req.clone({
                    setHeaders: {
                        'Authorization': `Bearer ${token}`,
                        //'Content-Type': 'application/json',
                        //'Accept': 'application/json'
                    },
                });
            }
        } else {
            this.exit();
        }

        return next.handle(req)
            .pipe(
                tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // do stuff with response if you want
                    }
                }, (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
                            // redirect to the login route
                            // or show a modal
                            this.exit();
                        } else if (err.statusText === 'Unknown Error') {
                            console.log(err);
                        }
                    }
                })
            );
    }
    private exit() {
        this.router.navigate(['login'], { queryParamsHandling: 'preserve' });
    }
}