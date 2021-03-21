import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams, HttpParameterCodec, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, delay, catchError, tap } from 'rxjs/operators';

import { AppConfig } from '../../app.config';
import { AppLocalization } from 'src/app/common/LocaleRes';

export class CustomEncoder implements HttpParameterCodec {
    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }

    encodeValue(value: string): string {
        return encodeURIComponent(value.replace(/\+/gi, '%2B'));
    }

    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    decodeValue(value: string): string {
        return decodeURIComponent(value);
    }
}

export interface IDataService<T> {
    get(urlParams?: any): Observable<T | T[]>;
    post(data: T | T[], urlAddition?: string): Promise<Object>;
    put(data: T): void;
    delete(id: any): Promise<Object>;
    //loadBinaryData(id: string): Observable<Blob>;
    //uploadBinaryData(fileToUpload: File): Observable<boolean>;
}

// удаленный источник данных
@Injectable({
    providedIn: 'root'
})
export class WebService<T> implements IDataService<T> {
    constructor(
        public http: HttpClient,
        public appConfig: AppConfig) {
    }

    private baseUrl: string;

    private _url: string;
    protected get URL(): string {
        if (this.baseUrl == null) {
            this.baseUrl = this.appConfig.getConfig('host');
        }
        return this.baseUrl + this._url;
    }
    protected set URL(n: string) {
        this._url = n;
    }
    //private generateUrlParams(key: string, params: any, httpParams: HttpParams, isFirst: boolean) {
    //    if (params instanceof Array) {
    //        for (let j = 0; j < params.length; j++) {
    //            this.generateUrlParams(key + "[]", params[j], httpParams, isFirst);
    //        }
    //    }
    //    else {
    //        if (!isFirst/*key.indexOf("[]") !== -1*/) {
    //            httpParams = httpParams.append(key, params);
    //        }
    //        else {
    //            httpParams = httpParams.set(key, params);
    //        }
    //    }
    //}
    get(urlParams?: any): Observable<T | T[]> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        headers = headers.append('Cache-Control', 'no-cache');
        headers = headers.append('Pragma', 'no-cache');
        headers = headers.append('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');        

        let params = new HttpParams({ encoder: new CustomEncoder() });
        let urlExtend = '';

        if (urlParams != undefined) {
            if (typeof urlParams === 'object') {
                let isFirst = true;
                const keys = Object.keys(urlParams);
                for (let i = 0; i < keys.length; i++) {
                    const values: any[] = [];
                    if (urlParams[keys[i]] != null) {
                        if (urlParams[keys[i]] instanceof Array) {
                            urlParams[keys[i]].forEach(
                                (data: any) => values.push(data)
                            );
                            keys[i] = keys[i] + '[]';
                        } else {
                            values.push(urlParams[keys[i]]);
                        }
                    }
                    for (let v = 0; v < values.length; v++) {
                        if (isFirst) {
                            isFirst = false;
                            params = new HttpParams().set(keys[i], values[v]);
                        } else
                            params = params.append(keys[i], values[v]);
                    }
                }
            }
            else {
                urlExtend = this.correctUrlAdditional(urlParams);
            }
        }

        return this.http.get<T | T[]>(this.URL + urlExtend, { headers: headers, params: params })
            .pipe(
                // delay(1000),
                catchError((error: any) => this.handleError(error))
            );
    }
    private correctUrlAdditional(urlAddition: string): string {
        let result = '';
        if (urlAddition != undefined && urlAddition !== '') {
            if (urlAddition[0] !== '/') result = '/' + urlAddition;
            else result = urlAddition;
        }
        return result;
    }
    post(data: T | T[], urlAddition?: string): Promise<Object> {
        const body = data;

        const headers = new HttpHeaders();        
        headers.set('Content-Type', 'application/json;charset=utf-8');

        return this.http.post(this.URL + this.correctUrlAdditional(urlAddition), body, { headers: headers })
            .toPromise()
            .catch(this.handlePromiseError);

    }
    postFormData(formData: FormData, urlAddition?: string) {

        const headers = new HttpHeaders();
        headers.set('Content-Type', 'multipart/form-data');

        return this.http
            .post(this.URL + this.correctUrlAdditional(urlAddition), formData, { headers: headers })
            .toPromise()
            .catch(this.handlePromiseError);
    }
    postLogin(data: any) {
        const body = data;

        const headers = new HttpHeaders();
        headers.set('Content-Type', 'application/x-www-form-urlencoded');

        //return new Promise((resolve, reject) => {
        //   resolve({
        //       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdCIsIm5iZiI6MTYxNTQ2MjQxMSwiZXhwIjoxNjE1NTM0NDExLCJpc3MiOiJhbGxtb25pdG9yaW5nLnJ1IiwiYXVkIjoiYWxsbW9uaXRvcmluZy5ydSJ9.6IEAI-WjyaPBOLKLiB11eDIiTHf0AUIE71wRkj_Vsy4",
        //       "UserName": "test",
        //       "IsSuperUser": "false",
        //       //"StartPage": "PersonalArea"
        //   });
        //});

        return this.http.post(this.URL, body, { headers: headers })
            //.pipe(
            //    tap((response: any) => { debugger; }),
            //    catchError(this.handlePromiseError)
            //)
            .toPromise()
            .catch(this.handlePromiseError);
    }
    put(data: T | T[], urlAddition?: string): Observable<any> {
        const body = data;

        const headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json;charset=utf-8');

        return this.http.put(this.URL + this.correctUrlAdditional(urlAddition), body, { headers });
    }

    putPromise(data: T | T[], urlAddition?: string): Promise<any> {
        return this.put(data, urlAddition)
            .toPromise()
            .catch(this.handlePromiseError);
    }
    delete(item: any, urlAddition?: string): Promise<Object> {
        let url = this.URL + this.correctUrlAdditional(urlAddition);
        return this.http.delete(url + '/' + item)
            .toPromise()
            .catch(this.handlePromiseError);
    }
    protected loadBinaryData(urlAddition?: string, params?: HttpParams): Observable<any> {
      //const headers = new HttpHeaders();
      return this.http.get(this.URL + this.correctUrlAdditional(urlAddition), 
        { params: params, observe: 'response', responseType: 'arraybuffer' })
            .pipe(
                map((response: any) => {
                    if (response.status === 204) { //no content
                        throw new HttpErrorResponse({ error: AppLocalization.NoFileFound });
                    } else {
                        let fileName = eval('decodeURIComponent(escape(atob(response.statusText)))');
                        let mimeType: string = response.headers.get('content-type');
                        return { blob: new Blob([response.body], { type: mimeType }), fileName: fileName };
                    }
                }),
                catchError((error: any) => this.handleError(error))
            );
    }
    protected uploadBinaryData(fileToUpload: File): Observable<boolean> {
        const formData: FormData = new FormData();
        formData.append('fileKey', fileToUpload, fileToUpload.name);
        return this.http
            .post(this.URL, formData/*, { headers: yourHeadersConfig }*/)
            .pipe(
                map(() => { return true; }),
                catchError((e: any) => this.handleError(e))
            );            
    }
    private handlePromiseError(response: HttpErrorResponse) {
        // output errors to the console.
        console.error(response.error);
        return Promise.reject(response.error || 'Server error');
    }
    private handleError(response: HttpErrorResponse) {
        // output errors to the console.
        console.error(response.error);
        return throwError(response.error || 'Server error');
    }
}
