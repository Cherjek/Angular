import { AppLocalization } from 'src/app/common/LocaleRes';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, queueScheduler, interval } from 'rxjs';
import { catchError, observeOn, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

const configAppStorageKey = 'configApp';

@Injectable()
export class AppConfig {

    private configLoadStart = false;
    private get config(): Object {
        return JSON.parse(localStorage.getItem(configAppStorageKey));
    }
    private set config(val: Object) {
        localStorage.setItem(configAppStorageKey, JSON.stringify(val));
    }
    private env: Object = null;

    constructor(private http: HttpClient) {

    }

    /**
     * Use to get the data found in the second file (config file)
     */
    public getConfig(key: any) {
        return (this.config || {})[key];
    }

    public getConfigObservable = (key: any) => {
      return new Observable(sbs => {
        const source = interval(100);
        const subscribe = source.subscribe(val => {
          if (this.getConfig(key) != null) {
            subscribe.unsubscribe();
            sbs.next(this.getConfig(key));
            sbs.complete();
          }
        });        
      });
    }

    /**
     * Use to get the data found in the first file (env file)
     */
    public getEnv(key: any) {
        return this.env[key];
    }

    /**
     * This method:
     *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
     *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
     */
    public load() {
        return () => {
            if (!this.configLoadStart) {
                this.configLoadStart = true;
    
                let mode: string;
                if (environment.production) {
                    mode = 'production';
                } else {
                    mode = 'development';
                }
                this.http.get('./config/config.' + mode + '.json')
                    .pipe(
                        catchError((error: any) => {
                            console.error(AppLocalization.Label45.replace('{0}', mode));
                            return Observable.throw(error.json().error || 'Server error');
                        }),
                        observeOn(queueScheduler) 
                    )
                    .subscribe((responseData: any) => {
                        this.config = responseData;
                    });
            }
        }
    }
}